-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
  payment_method VARCHAR(20) NOT NULL,
  shipping_address JSONB,
  items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de segurança para a tabela orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política para usuários autenticados verem seus próprios pedidos
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários autenticados inserirem seus próprios pedidos
CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para admins verem todos os pedidos
CREATE POLICY "Admins can view all orders" ON orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 