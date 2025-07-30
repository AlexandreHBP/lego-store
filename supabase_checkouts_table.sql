-- Tabela para armazenar checkouts do PagBank
CREATE TABLE IF NOT EXISTS checkouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_id TEXT UNIQUE NOT NULL,
  pagbank_order_id TEXT,
  customer_data JSONB NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'failed')),
  redirect_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_checkouts_reference_id ON checkouts(reference_id);
CREATE INDEX IF NOT EXISTS idx_checkouts_pagbank_order_id ON checkouts(pagbank_order_id);
CREATE INDEX IF NOT EXISTS idx_checkouts_status ON checkouts(status);
CREATE INDEX IF NOT EXISTS idx_checkouts_created_at ON checkouts(created_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_checkouts_updated_at 
    BEFORE UPDATE ON checkouts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security)
ALTER TABLE checkouts ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de checkouts
CREATE POLICY "Allow insert checkouts" ON checkouts
    FOR INSERT WITH CHECK (true);

-- Política para permitir leitura de checkouts
CREATE POLICY "Allow read checkouts" ON checkouts
    FOR SELECT USING (true);

-- Política para permitir atualização de checkouts
CREATE POLICY "Allow update checkouts" ON checkouts
    FOR UPDATE USING (true);

-- Comentários para documentação
COMMENT ON TABLE checkouts IS 'Tabela para armazenar checkouts do PagBank';
COMMENT ON COLUMN checkouts.reference_id IS 'ID único do pedido gerado pela aplicação';
COMMENT ON COLUMN checkouts.pagbank_order_id IS 'ID do pedido retornado pelo PagBank';
COMMENT ON COLUMN checkouts.customer_data IS 'Dados do cliente em formato JSON';
COMMENT ON COLUMN checkouts.items IS 'Itens do pedido em formato JSON';
COMMENT ON COLUMN checkouts.total_amount IS 'Valor total do pedido';
COMMENT ON COLUMN checkouts.status IS 'Status do pagamento: pending, paid, cancelled, failed';
COMMENT ON COLUMN checkouts.redirect_url IS 'URL de redirecionamento após pagamento';
COMMENT ON COLUMN checkouts.paid_at IS 'Data e hora do pagamento confirmado'; 