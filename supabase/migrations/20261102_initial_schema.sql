-- ==============================================================================
-- TRADITIONAL INDIAN SNACKS - POORNALU ONLINE ORDERING PLATFORM
-- Comprehensive PostgreSQL Schema, RLS, Triggers & Security Definer Functions
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
-- Stores public customer details tied to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for searching customers
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON public.profiles(full_name);

-- 2. USER ROLES TABLE
-- Stores secure role assignments (admin, customer).
-- Protected so users cannot escalate their own roles.
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_role UNIQUE (user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- 3. PRODUCTS TABLE
-- Stores Poornalu / Poornam Boorelu product offerings and current pricing
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    unit TEXT DEFAULT 'Box of 10 pcs',
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. ORDERS TABLE
-- Stores customer orders for traditional Poornalu
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    total_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    delivery_type TEXT NOT NULL CHECK (delivery_type IN ('pickup', 'delivery')),
    delivery_address TEXT,
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    instructions TEXT,
    order_status TEXT NOT NULL DEFAULT 'Pending' 
        CHECK (order_status IN ('Pending', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'Unpaid' 
        CHECK (payment_status IN ('Unpaid', 'Paid', 'Refunded')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 5. ORDER STATUS HISTORY TABLE
-- Tracks audit trail and customer tracking timeline events
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    notes TEXT,
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON public.order_status_history(order_id);

-- ==============================================================================
-- SECURITY DEFINER HELPER FUNCTIONS
-- ==============================================================================

-- Check if current authenticated user has 'admin' role
CREATE OR REPLACE FUNCTION public.is_admin(lookup_uid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = lookup_uid AND role = 'admin'
    );
$$;

-- Function to handle status history logging automatically via trigger
CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.order_status_history (order_id, old_status, new_status, notes, updated_by)
        VALUES (NEW.id, NULL, NEW.order_status, 'Order initiated by customer', NEW.customer_id);
    ELSIF (TG_OP = 'UPDATE' AND OLD.order_status IS DISTINCT FROM NEW.order_status) THEN
        INSERT INTO public.order_status_history (order_id, old_status, new_status, notes, updated_by)
        VALUES (NEW.id, OLD.order_status, NEW.order_status, 'Status updated by admin', auth.uid());
    END IF;
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_log_order_status ON public.orders;
CREATE TRIGGER trigger_log_order_status
AFTER INSERT OR UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.log_order_status_change();

-- Profile updated_at trigger
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_timestamp();

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_timestamp();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------
-- Customers can read their own profile; Admins can read all profiles
DROP POLICY IF EXISTS "Profiles read access" ON public.profiles;
CREATE POLICY "Profiles read access" ON public.profiles
    FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

-- Customers can insert their own profile on registration
DROP POLICY IF EXISTS "Profiles insert access" ON public.profiles;
CREATE POLICY "Profiles insert access" ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id OR public.is_admin());

-- Customers can update permitted profile fields; Admins can update any profile
DROP POLICY IF EXISTS "Profiles update access" ON public.profiles;
CREATE POLICY "Profiles update access" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id OR public.is_admin())
    WITH CHECK (auth.uid() = id OR public.is_admin());

-- ----------------------------------------------------
-- USER ROLES POLICIES
-- ----------------------------------------------------
-- Users can view their own role; Admins can view all roles
DROP POLICY IF EXISTS "User roles select access" ON public.user_roles;
CREATE POLICY "User roles select access" ON public.user_roles
    FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

-- Only Admins can insert, update or delete user roles (prevents privilege escalation)
DROP POLICY IF EXISTS "User roles admin insert" ON public.user_roles;
CREATE POLICY "User roles admin insert" ON public.user_roles
    FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "User roles admin update" ON public.user_roles;
CREATE POLICY "User roles admin update" ON public.user_roles
    FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "User roles admin delete" ON public.user_roles;
CREATE POLICY "User roles admin delete" ON public.user_roles
    FOR DELETE
    USING (public.is_admin());

-- ----------------------------------------------------
-- PRODUCTS POLICIES
-- ----------------------------------------------------
-- Anyone (authenticated or public visitor) can view available products
DROP POLICY IF EXISTS "Products viewable by all" ON public.products;
CREATE POLICY "Products viewable by all" ON public.products
    FOR SELECT
    USING (true);

-- Only Admins can insert, update, or delete products
DROP POLICY IF EXISTS "Products admin insert" ON public.products;
CREATE POLICY "Products admin insert" ON public.products
    FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Products admin update" ON public.products;
CREATE POLICY "Products admin update" ON public.products
    FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Products admin delete" ON public.products;
CREATE POLICY "Products admin delete" ON public.products
    FOR DELETE
    USING (public.is_admin());

-- ----------------------------------------------------
-- ORDERS POLICIES
-- ----------------------------------------------------
-- Customers can view only their own orders; Admins can view all orders
DROP POLICY IF EXISTS "Orders select policy" ON public.orders;
CREATE POLICY "Orders select policy" ON public.orders
    FOR SELECT
    USING (auth.uid() = customer_id OR public.is_admin());

-- Customers can create orders for themselves with initial Pending status
DROP POLICY IF EXISTS "Orders insert policy" ON public.orders;
CREATE POLICY "Orders insert policy" ON public.orders
    FOR INSERT
    WITH CHECK (
        auth.uid() = customer_id 
        AND order_status = 'Pending' 
        AND payment_status = 'Unpaid'
    );

-- Only Admins can update orders (e.g. status, payment, notes). Customers CANNOT modify status!
DROP POLICY IF EXISTS "Orders update policy" ON public.orders;
CREATE POLICY "Orders update policy" ON public.orders
    FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ----------------------------------------------------
-- ORDER STATUS HISTORY POLICIES
-- ----------------------------------------------------
-- Customers can read tracking history of their own orders; Admins can view all
DROP POLICY IF EXISTS "Order status history select" ON public.order_status_history;
CREATE POLICY "Order status history select" ON public.order_status_history
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_status_history.order_id 
            AND (orders.customer_id = auth.uid() OR public.is_admin())
        )
    );

-- Log entries inserted by trigger or by admin
DROP POLICY IF EXISTS "Order status history insert" ON public.order_status_history;
CREATE POLICY "Order status history insert" ON public.order_status_history
    FOR INSERT
    WITH CHECK (
        auth.uid() = updated_by OR public.is_admin()
    );

-- ==============================================================================
-- INITIAL SEED DATA
-- Default Poornalu (Poornam Boorelu) Product
-- Note: Price is set to 0.00 so the UI displays "Contact us for price" initially.
-- The admin can configure the exact price anytime from the admin portal.
-- ==============================================================================

INSERT INTO public.products (id, name, description, price, unit, is_available, image_url)
VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'Andhra Poornalu (Poornam Boorelu)',
    'Traditional homemade Andhra festival delicacy featuring a crispy golden outer shell made of fermented rice-urad dal batter, stuffed with a decadent filling of slow-cooked Bengal gram (chana dal), aromatic organic jaggery, fresh grated coconut and fragrant green cardamom. Deep-fried to perfection in pure cow ghee and cold-pressed oil.',
    0.00,
    'Box of 10 pcs',
    true,
    '/images/poornalu-brass-plate.jpg'
)
ON CONFLICT (id) DO NOTHING;
