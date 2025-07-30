-- Script para configurar o banco de dados do Supabase para o e-commerce
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL,
  images TEXT[],
  features TEXT[],
  specifications JSONB,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar tabela de mensagens de contato
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Criar triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Criar função para criar perfil automaticamente quando um usuário se registra
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName',
    'user'
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Criar trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 9. Configurar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 10. Criar políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 11. Criar políticas para products (público para leitura, admin para escrita)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Products are insertable by admin" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Products are updatable by admin" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Products are deletable by admin" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 12. Criar políticas para orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- 13. Criar políticas para contact_messages
CREATE POLICY "Contact messages are insertable by everyone" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Contact messages are viewable by admin" ON contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Contact messages are updatable by admin" ON contact_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Contact messages are deletable by admin" ON contact_messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 14. Inserir alguns produtos de exemplo
INSERT INTO products (name, description, price, original_price, category, images, features, specifications, stock_quantity) VALUES
(
  'Produto Premium 1',
  'Produto de alta qualidade com design moderno e funcionalidades avançadas.',
  299.99,
  399.99,
  'eletronicos',
  ARRAY['https://via.placeholder.com/600x600/000000/FFFFFF?text=Produto+1', 'https://via.placeholder.com/600x600/000000/FFFFFF?text=Imagem+2'],
  ARRAY['Design moderno e elegante', 'Material de alta qualidade', 'Funcionalidades avançadas'],
  '{"Dimensões": "15 x 10 x 5 cm", "Peso": "500g", "Material": "Alumínio premium"}',
  15
),
(
  'Produto Premium 2',
  'Ideal para sua casa com acabamento premium e funcionalidade excepcional.',
  199.99,
  249.99,
  'casa',
  ARRAY['https://via.placeholder.com/600x600/000000/FFFFFF?text=Produto+2'],
  ARRAY['Acabamento premium', 'Funcionalidade excepcional', 'Fácil instalação'],
  '{"Dimensões": "20 x 15 x 8 cm", "Peso": "800g", "Material": "Aço inoxidável"}',
  8
),
(
  'Produto Premium 3',
  'Tecnologia avançada com performance excepcional e design inovador.',
  399.99,
  499.99,
  'eletronicos',
  ARRAY['https://via.placeholder.com/600x600/000000/FFFFFF?text=Produto+3'],
  ARRAY['Tecnologia avançada', 'Performance excepcional', 'Design inovador'],
  '{"Dimensões": "25 x 18 x 12 cm", "Peso": "1.2kg", "Material": "Titânio"}',
  12
);

-- 15. Criar um usuário admin (substitua o email pelo seu)
-- INSERT INTO profiles (id, first_name, last_name, role)
-- VALUES (
--   'SEU_USER_ID_AQUI', -- Substitua pelo ID do seu usuário
--   'Admin',
--   'User',
--   'admin'
-- );

-- Para tornar um usuário existente admin, execute:
-- UPDATE profiles SET role = 'admin' WHERE id = 'SEU_USER_ID_AQUI'; 