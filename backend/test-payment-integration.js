import './test-config.js'
import { supabase } from './config/supabase.js'

// Teste da integração de pagamento
const testPaymentIntegration = async () => {
  console.log('🧪 Testando integração de pagamento...')
  
  try {
    // 1. Testar conexão com Supabase
    console.log('1. Testando conexão com Supabase...')
    const { data: testData, error: testError } = await supabase
      .from('checkouts')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Erro na conexão com Supabase:', testError)
      return
    }
    
    console.log('✅ Conexão com Supabase OK')
    
    // 2. Testar criação de checkout
    console.log('2. Testando criação de checkout...')
    
    const testCheckout = {
      reference_id: `test_${Date.now()}`,
      pagbank_order_id: `mock_order_${Date.now()}`,
      customer_data: {
        name: 'Teste Cliente',
        email: 'teste@exemplo.com',
        tax_id: '12345678901',
        phone: '11999999999'
      },
      items: [
        {
          id: 1,
          name: 'LEGO Teste',
          quantity: 1,
          unit_amount: 99.99
        }
      ],
      total_amount: 99.99,
      status: 'pending',
      redirect_url: 'http://localhost:5173/payment/success'
    }
    
    const { data: insertedCheckout, error: insertError } = await supabase
      .from('checkouts')
      .insert(testCheckout)
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ Erro ao inserir checkout:', insertError)
      return
    }
    
    console.log('✅ Checkout criado com sucesso:', insertedCheckout.id)
    
    // 3. Testar consulta de checkout
    console.log('3. Testando consulta de checkout...')
    
    const { data: fetchedCheckout, error: fetchError } = await supabase
      .from('checkouts')
      .select('*')
      .eq('reference_id', testCheckout.reference_id)
      .single()
    
    if (fetchError) {
      console.error('❌ Erro ao buscar checkout:', fetchError)
      return
    }
    
    console.log('✅ Checkout consultado com sucesso:', fetchedCheckout.reference_id)
    
    // 4. Testar atualização de status
    console.log('4. Testando atualização de status...')
    
    const { data: updatedCheckout, error: updateError } = await supabase
      .from('checkouts')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('reference_id', testCheckout.reference_id)
      .select()
      .single()
    
    if (updateError) {
      console.error('❌ Erro ao atualizar checkout:', updateError)
      return
    }
    
    console.log('✅ Status atualizado com sucesso:', updatedCheckout.status)
    
    // 5. Limpar dados de teste
    console.log('5. Limpando dados de teste...')
    
    const { error: deleteError } = await supabase
      .from('checkouts')
      .delete()
      .eq('reference_id', testCheckout.reference_id)
    
    if (deleteError) {
      console.error('❌ Erro ao deletar checkout de teste:', deleteError)
      return
    }
    
    console.log('✅ Dados de teste removidos')
    
    console.log('🎉 Todos os testes passaram! A integração está funcionando corretamente.')
    
  } catch (error) {
    console.error('❌ Erro geral no teste:', error)
  }
}

// Executar teste
testPaymentIntegration() 