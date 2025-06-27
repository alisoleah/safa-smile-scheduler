
-- Grant admin access to the user ali.soleah@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::user_role
FROM auth.users
WHERE email = 'ali.soleah@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
