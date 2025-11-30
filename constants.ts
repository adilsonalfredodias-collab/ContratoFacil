import { PlanDetails, ContractTemplate, BlogPost } from './types';

export const PLANS: Record<string, PlanDetails> = {
  free: {
    id: 'free',
    name: 'Gratuito',
    limit: 3,
    price: 0,
    features: ['3 contratos/mês', 'Modelos básicos', 'Exportação PDF'],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    limit: 15,
    price: 2000,
    features: ['15 contratos/mês', 'Todos os modelos', 'Exportação Word & PDF', 'Suporte prioritário'],
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    limit: 40,
    price: 5000,
    features: ['40 contratos/mês', 'Editor avançado', 'Sem marca d\'água', 'Gestão de clientes'],
  },
};

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'servicos',
    name: 'Prestação de Serviços (Avançado)',
    description: 'Contrato robusto para profissionais e empresas. Inclui cláusulas de PI, Confidencialidade (NDA), Proteção de Dados e Rescisão detalhada.',
    defaultContent: `
      <h1 style="text-align: center; font-weight: bold; margin-bottom: 40px; font-size: 16pt; text-transform: uppercase; font-family: 'Times New Roman', serif;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
      
      <p style="text-align: justify; margin-bottom: 15px; line-height: 1.6;">
        Pelo presente instrumento particular, de um lado:
      </p>

      <p style="text-align: justify; margin-bottom: 15px; line-height: 1.6;">
        <strong>CONTRATANTE:</strong> {{contratante_nome}}, com NIF nº {{contratante_nif}}, com sede/domicílio em {{contratante_endereco}}, doravante denominada simplesmente <strong>CONTRATANTE</strong>.
      </p>

      <p style="text-align: justify; margin-bottom: 15px; line-height: 1.6;">
        <strong>CONTRATADA:</strong> {{contratado_nome}}, com NIF nº {{contratado_nif}}, com sede/domicílio em {{contratado_endereco}}, doravante denominada simplesmente <strong>CONTRATADA</strong>.
      </p>

      <p style="text-align: justify; margin-bottom: 15px; line-height: 1.6;">
        As partes acima qualificadas têm, entre si, justo e contratado o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas e condições seguintes:
      </p>
      
      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 11pt;">CLÁUSULA PRIMEIRA - DO OBJETO</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        1.1. O presente contrato tem por objeto a prestação de serviços técnicos profissionais de <strong>{{descricao_servico}}</strong> pela CONTRATADA à CONTRATANTE.
      </p>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        1.2. Os serviços serão executados com total autonomia técnica e operacional pela CONTRATADA, não gerando vínculo empregatício, societário ou associativo de qualquer natureza com a CONTRATANTE.
      </p>
      
      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 11pt;">CLÁUSULA SEGUNDA - DO PREÇO E PAGAMENTO</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        2.1. Pela execução dos serviços objeto deste contrato, a CONTRATANTE pagará à CONTRATADA o valor total bruto de <strong>{{valor_total}}</strong>.
      </p>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        2.2. O pagamento será realizado da seguinte forma: {{forma_pagamento}}.
      </p>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        2.3. Em caso de atraso no pagamento, incidirá multa moratória de 2% (dois por cento) sobre o valor devido, acrescida de juros de 1% (um por cento) ao mês e correção monetária.
      </p>
      
      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 11pt;">CLÁUSULA TERCEIRA - DO PRAZO</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        3.1. O presente contrato terá início em {{data_inicio}} e término previsto para {{data_fim}}, podendo ser prorrogado mediante termo aditivo assinado por ambas as partes.
      </p>
      
      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 11pt;">CLÁUSULA QUARTA - DAS OBRIGAÇÕES</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        4.1. <strong>São obrigações da CONTRATADA:</strong><br>
        a) Executar os serviços contratados com zelo, diligência e dentro dos padrões técnicos exigidos;<br>
        b) Cumprir os prazos estipulados no cronograma;<br>
        c) Responsabilizar-se por todos os encargos laborais, previdenciários e fiscais de sua equipe.
      </p>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        4.2. <strong>São obrigações da CONTRATANTE:</strong><br>
        a) Fornecer todas as informações, acessos e materiais necessários para a execução do serviço;<br>
        b) Efetuar os pagamentos nas datas aprazadas;<br>
        c) Aprovar ou solicitar revisões dos entregáveis dentro de um prazo razoável.
      </p>

      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 11pt;">CLÁUSULA QUINTA - DA PROPRIEDADE INTELECTUAL</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        5.1. Salvo disposição expressa em contrário, todo o material original desenvolvido especificamente para a CONTRATANTE em virtude deste contrato passará a ser de propriedade exclusiva da CONTRATANTE após a quitação integral dos valores acordados.
      </p>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        5.2. A CONTRATADA garante que os entregáveis são originais e não violam direitos de propriedade intelectual de terceiros.
      </p>

      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 11pt;">CLÁUSULA SEXTA - DA CONFIDENCIALIDADE</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        6.1. As partes comprometem-se a manter o mais absoluto sigilo sobre quaisquer dados, informações técnicas, comerciais ou estratégicas a que tiverem acesso em virtude deste contrato ("Informações Confidenciais").
      </p>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        6.2. O dever de confidencialidade perdurará durante a vigência deste contrato e pelo prazo de 2 (dois) anos após o seu término.
      </p>

      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 11pt;">CLÁUSULA SÉTIMA - DA PROTEÇÃO DE DADOS</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        7.1. As partes declaram cumprir a legislação aplicável sobre proteção de dados pessoais. A CONTRATADA tratará os dados pessoais fornecidos pela CONTRATANTE única e exclusivamente para os fins de execução deste contrato.
      </p>

      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 11pt;">CLÁUSULA OITAVA - DA RESCISÃO E PENALIDADES</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        8.1. Este contrato poderá ser rescindido imotivadamente por qualquer das partes, mediante notificação por escrito com antecedência mínima de <strong>{{prazo_aviso_previo}}</strong> dias.
      </p>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        8.2. Em caso de rescisão antecipada sem o cumprimento do aviso prévio ou por quebra contratual, será devida uma multa compensatória no valor de: {{multa_rescisao}}.
      </p>

      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 11pt;">CLÁUSULA NONA - DO FORO</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        9.1. As partes elegem o foro da Comarca de <strong>{{foro_cidade}}</strong> para dirimir quaisquer dúvidas ou controvérsias oriundas deste contrato, com renúncia expressa a qualquer outro.
      </p>
      
      <div style="margin-top: 80px; display: flex; justify-content: space-between; page-break-inside: avoid;">
        <div style="text-align: center; width: 45%;">
          <hr style="border-top: 1px solid #000; margin-bottom: 5px;" />
          <p style="font-weight: bold;">{{contratante_nome}}</p>
          <p style="font-size: 10pt;">Contratante</p>
        </div>
        <div style="text-align: center; width: 45%;">
          <hr style="border-top: 1px solid #000; margin-bottom: 5px;" />
          <p style="font-weight: bold;">{{contratado_nome}}</p>
          <p style="font-size: 10pt;">Contratada</p>
        </div>
      </div>
      
      <div style="margin-top: 40px; page-break-inside: avoid;">
        <p style="font-weight: bold; margin-bottom: 20px;">Testemunhas:</p>
        <div style="display: flex; justify-content: space-between;">
           <div style="width: 45%;">
             <hr style="border-top: 1px solid #ccc; width: 100%; margin-bottom: 5px;" />
             <p style="font-size: 10pt;">Nome:</p>
             <p style="font-size: 10pt;">BI:</p>
           </div>
           <div style="width: 45%;">
             <hr style="border-top: 1px solid #ccc; width: 100%; margin-bottom: 5px;" />
             <p style="font-size: 10pt;">Nome:</p>
             <p style="font-size: 10pt;">BI:</p>
           </div>
        </div>
      </div>

      <p style="text-align: center; margin-top: 60px; font-size: 10pt;">{{foro_cidade}}, {{data_atual}}</p>
    `,
    fields: [
      { key: 'contratante_nome', label: 'Nome da Contratante (Cliente)', type: 'text' },
      { key: 'contratante_nif', label: 'NIF/BI Contratante', type: 'text' },
      { key: 'contratante_endereco', label: 'Endereço Contratante', type: 'text' },
      { key: 'contratado_nome', label: 'Nome da Contratada (Você)', type: 'text' },
      { key: 'contratado_nif', label: 'NIF/BI Contratada', type: 'text' },
      { key: 'contratado_endereco', label: 'Endereço Contratada', type: 'text' },
      { key: 'descricao_servico', label: 'Descrição Detalhada dos Serviços', type: 'textarea', placeholder: 'Descreva escopo, entregáveis e o que NÃO está incluso.' },
      { key: 'valor_total', label: 'Valor Total (ex: 50.000,00 Kz)', type: 'currency' },
      { key: 'forma_pagamento', label: 'Condições de Pagamento', type: 'textarea', placeholder: 'Ex: 50% na assinatura e 50% na entrega. Transferência para o IBAN AO06...' },
      { key: 'data_inicio', label: 'Data de Início', type: 'date' },
      { key: 'data_fim', label: 'Data de Término', type: 'date' },
      { key: 'prazo_aviso_previo', label: 'Dias de Aviso Prévio (Rescisão)', type: 'number', placeholder: 'Ex: 30' },
      { key: 'multa_rescisao', label: 'Multa por Rescisão Antecipada', type: 'textarea', placeholder: 'Ex: 50% do valor restante do contrato.' },
      { key: 'foro_cidade', label: 'Cidade do Foro (Tribunal)', type: 'text', placeholder: 'Ex: Luanda' },
    ]
  },
  {
    id: 'aluguel',
    name: 'Contrato de Arrendamento Urbano',
    description: 'Modelo completo para locação de imóveis residenciais ou comerciais, com vistoria e caução.',
    defaultContent: `
      <h1 style="text-align: center; font-weight: bold; margin-bottom: 40px; font-size: 16pt; text-transform: uppercase;">Contrato de Arrendamento Urbano</h1>
      
      <p style="text-align: justify; margin-bottom: 15px; line-height: 1.6;">
        <strong>PRIMEIRO OUTORGANTE (SENHORIO):</strong> {{locador_nome}}, titular do BI/NIF nº {{locador_bi}}, residente em {{locador_endereco}}.
      </p>
      <p style="text-align: justify; margin-bottom: 15px; line-height: 1.6;">
        <strong>SEGUNDO OUTORGANTE (INQUILINO):</strong> {{locatario_nome}}, titular do BI/NIF nº {{locatario_bi}}, residente em {{locatario_endereco}}.
      </p>
      
      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 12pt;">Cláusula Primeira - Identificação e Objeto</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        1.1. O SENHORIO é proprietário e legítimo possuidor do imóvel sito em: <strong>{{endereco_imovel}}</strong>.
      </p>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        1.2. Pelo presente contrato, o SENHORIO cede ao INQUILINO o uso e gozo do referido imóvel.
      </p>
      
      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 12pt;">Cláusula Segunda - Do Fim a que se Destina</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        2.1. O imóvel destina-se exclusivamente a fins habitacionais do INQUILINO e seu agregado familiar, sendo expressamente vedada a sublocação, cessão ou empréstimo, total ou parcial, a terceiros sem o consentimento prévio e por escrito do SENHORIO.
      </p>

      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 12pt;">Cláusula Terceira - Do Prazo</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        3.1. O prazo do arrendamento é de {{meses_duracao}} meses, com início em {{data_inicio}} e término em {{data_fim}}.
      </p>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        3.2. O contrato renova-se automaticamente por iguais períodos, salvo se qualquer das partes se opuser à renovação mediante comunicação por carta registada com antecedência mínima de 60 dias.
      </p>
      
      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 12pt;">Cláusula Quarta - Da Renda e Encargos</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        4.1. A renda mensal acordada é de <strong>{{valor_mensal}}</strong>.
      </p>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        4.2. A renda deverá ser paga até o dia {{dia_vencimento}} do mês a que disser respeito, através de depósito ou transferência bancária.
      </p>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        4.3. As despesas de consumo corrente, nomeadamente água, energia elétrica, internet e taxa de condomínio (se aplicável), são da inteira responsabilidade do INQUILINO.
      </p>

      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 12pt;">Cláusula Quinta - Conservação</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        5.1. O INQUILINO declara receber o imóvel em bom estado de conservação, obrigando-se a mantê-lo e devolvê-lo nas mesmas condições, ressalvado o desgaste natural decorrente do uso prudente.
      </p>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        5.2. É vedada a realização de obras estruturais sem autorização do SENHORIO. Benfeitorias necessárias serão indenizáveis apenas se autorizadas por escrito.
      </p>

      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 12pt;">Cláusula Sexta - Foro</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        6.1. Para dirimir quaisquer questões resultantes deste contrato, as partes elegem o foro da Comarca de {{cidade}}, com renúncia a qualquer outro.
      </p>

      <div style="margin-top: 100px; display: flex; justify-content: space-between;">
        <div style="text-align: center; width: 45%;">
          <hr style="border-top: 1px solid #000;" />
          <p style="margin-top: 10px;"><strong>{{locador_nome}}</strong><br/><span style="font-size: 10pt;">Senhorio</span></p>
        </div>
        <div style="text-align: center; width: 45%;">
          <hr style="border-top: 1px solid #000;" />
          <p style="margin-top: 10px;"><strong>{{locatario_nome}}</strong><br/><span style="font-size: 10pt;">Inquilino</span></p>
        </div>
      </div>
      <p style="text-align: center; margin-top: 60px; font-size: 10pt;">{{cidade}}, {{data_atual}}</p>
    `,
    fields: [
      { key: 'locador_nome', label: 'Nome do Senhorio', type: 'text' },
      { key: 'locador_bi', label: 'BI/NIF do Senhorio', type: 'text' },
      { key: 'locador_endereco', label: 'Endereço Atual do Senhorio', type: 'text' },
      { key: 'locatario_nome', label: 'Nome do Inquilino', type: 'text' },
      { key: 'locatario_bi', label: 'BI/NIF do Inquilino', type: 'text' },
      { key: 'locatario_endereco', label: 'Endereço Atual do Inquilino', type: 'text' },
      { key: 'endereco_imovel', label: 'Endereço do Imóvel a Arrendar', type: 'text' },
      { key: 'meses_duracao', label: 'Duração (Meses)', type: 'number' },
      { key: 'data_inicio', label: 'Data de Início', type: 'date' },
      { key: 'data_fim', label: 'Data de Término', type: 'date' },
      { key: 'valor_mensal', label: 'Valor da Renda (Kz)', type: 'currency' },
      { key: 'dia_vencimento', label: 'Dia do Vencimento (ex: 5)', type: 'number' },
      { key: 'cidade', label: 'Cidade da Assinatura', type: 'text', placeholder: 'Ex: Luanda' },
    ]
  },
  {
    id: 'compra_venda',
    name: 'Compra e Venda de Bem Móvel',
    description: 'Transações de veículos, equipamentos ou bens móveis com cláusulas de garantia e evicção.',
    defaultContent: `
      <h1 style="text-align: center; font-weight: bold; margin-bottom: 40px; font-size: 16pt; text-transform: uppercase;">Contrato de Compra e Venda de Bem Móvel</h1>
      
      <p style="text-align: justify; margin-bottom: 15px; line-height: 1.6;">
        <strong>VENDEDOR:</strong> {{vendedor_nome}}, portador do documento nº {{vendedor_doc}}, residente e domiciliado em {{vendedor_endereco}}.
      </p>
      <p style="text-align: justify; margin-bottom: 15px; line-height: 1.6;">
        <strong>COMPRADOR:</strong> {{comprador_nome}}, portador do documento nº {{comprador_doc}}, residente e domiciliado em {{comprador_endereco}}.
      </p>
      
      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 12pt;">Cláusula Primeira - Do Objeto</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        1.1. Pelo presente instrumento, o VENDEDOR vende ao COMPRADOR o bem móvel de sua propriedade, livre e desembaraçado de quaisquer ônus (penhoras, dívidas ou restrições), com as seguintes características:
      </p>
      <p style="background-color: #f9fafb; padding: 10px; border: 1px solid #e5e7eb; margin-bottom: 10px; font-family: monospace;">
        <strong>{{descricao_bem}}</strong>
      </p>
      
      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 12pt;">Cláusula Segunda - Do Preço</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        2.1. O preço certo e ajustado para a venda do bem acima descrito é de <strong>{{valor_venda}}</strong>.
      </p>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        2.2. O pagamento será satisfeito da seguinte forma: {{forma_pagamento}}.
      </p>
      
      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 12pt;">Cláusula Terceira - Da Entrega e Tradição</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        3.1. A entrega do bem será efetivada em {{data_entrega}}, local onde o COMPRADOR vistoriará o bem, aceitando-o no estado em que se encontra.
      </p>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        3.2. Com a tradição (entrega) do bem, transferem-se para o COMPRADOR todos os riscos e responsabilidades sobre o mesmo.
      </p>

      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 12pt;">Cláusula Quarta - Da Evicção e Vícios</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        4.1. O VENDEDOR responde pela evicção de direito (garantia de que o bem lhe pertence) e por vícios ocultos redibitórios existentes anteriores à venda.
      </p>

      <h3 style="margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; font-size: 12pt;">Cláusula Quinta - Disposições Gerais</h3>
      <p style="text-align: justify; margin-bottom: 10px; line-height: 1.6;">
        5.1. O presente contrato obriga as partes e seus sucessores.
      </p>

      <div style="margin-top: 100px; display: flex; justify-content: space-between;">
        <div style="text-align: center; width: 45%;">
          <hr style="border-top: 1px solid #000;" />
          <p style="margin-top: 10px;"><strong>{{vendedor_nome}}</strong><br/><span style="font-size: 10pt;">Vendedor</span></p>
        </div>
        <div style="text-align: center; width: 45%;">
          <hr style="border-top: 1px solid #000;" />
          <p style="margin-top: 10px;"><strong>{{comprador_nome}}</strong><br/><span style="font-size: 10pt;">Comprador</span></p>
        </div>
      </div>
      <p style="text-align: center; margin-top: 60px; font-size: 10pt;">{{data_atual}}</p>
    `,
    fields: [
      { key: 'vendedor_nome', label: 'Nome do Vendedor', type: 'text' },
      { key: 'vendedor_doc', label: 'Documento do Vendedor', type: 'text' },
      { key: 'vendedor_endereco', label: 'Endereço do Vendedor', type: 'text' },
      { key: 'comprador_nome', label: 'Nome do Comprador', type: 'text' },
      { key: 'comprador_doc', label: 'Documento do Comprador', type: 'text' },
      { key: 'comprador_endereco', label: 'Endereço do Comprador', type: 'text' },
      { key: 'descricao_bem', label: 'Descrição do Bem (Marca, Modelo, Nº Série)', type: 'textarea' },
      { key: 'valor_venda', label: 'Valor da Venda (Kz)', type: 'currency' },
      { key: 'forma_pagamento', label: 'Forma de Pagamento', type: 'textarea' },
      { key: 'data_entrega', label: 'Data da Entrega', type: 'date' },
    ]
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'importancia-contratos',
    title: 'Por que Formalizar Relações Laborais em Angola?',
    excerpt: 'Descubra a importância jurídica de ter um contrato assinado e como isso protege ambas as partes em caso de litígio.',
    content: `
      <p class="mb-4">Em um mercado cada vez mais dinâmico como o angolano, a informalidade ainda é uma prática comum. No entanto, estabelecer relações laborais ou comerciais sem um contrato formal é um risco que pode custar caro.</p>
      
      <h3 class="text-xl font-bold mb-2 text-slate-800">Segurança Jurídica</h3>
      <p class="mb-4">O contrato é a lei entre as partes. Sem ele, fica difícil provar o que foi acordado, prazos, valores e obrigações. Em caso de incumprimento, um documento assinado e, preferencialmente, reconhecido em notário, é a principal prova num tribunal.</p>

      <h3 class="text-xl font-bold mb-2 text-slate-800">Clareza nas Expectativas</h3>
      <p class="mb-4">Muitos conflitos surgem não por má-fé, mas por falta de comunicação. O contrato detalha o que se espera de cada parte: prazos de entrega, qualidade do serviço, e penalidades por atraso.</p>

      <h3 class="text-xl font-bold mb-2 text-slate-800">Profissionalismo</h3>
      <p class="mb-4">Apresentar um contrato bem elaborado transmite seriedade e profissionalismo. Clientes e parceiros tendem a confiar mais em prestadores de serviço que se preocupam com a formalização do negócio.</p>

      <p class="mb-4">Não deixe para depois. Utilize ferramentas como o <strong>ContratoFácil</strong> para gerar seus documentos em minutos e garantir a tranquilidade do seu negócio.</p>
    `,
    author: 'Dra. Ana Costa (Jurista)',
    date: '12 Out 2023',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'dicas-freelancers',
    title: '5 Dicas Essenciais para Freelancers: Blindando seu Trabalho',
    excerpt: 'Evite calotes e mal-entendidos. Veja quais cláusulas não podem faltar no seu contrato de prestação de serviços.',
    content: `
      <p class="mb-4">Ser freelancer oferece liberdade, mas também exige responsabilidade redobrada com a gestão do negócio. O contrato é seu melhor amigo.</p>
      
      <h3 class="text-xl font-bold mb-2 text-slate-800">1. Defina o Escopo com Precisão</h3>
      <p class="mb-4">Não aceite "fazer um site". Defina quantas páginas, quais funcionalidades e o que NÃO está incluso. Isso evita o famoso "scope creep" (aumento de escopo não remunerado).</p>

      <h3 class="text-xl font-bold mb-2 text-slate-800">2. Estabeleça Marcos de Pagamento</h3>
      <p class="mb-4">Nunca deixe 100% do pagamento para o final. Uma prática comum é 50% no início e 50% na entrega. Isso garante fluxo de caixa e compromisso do cliente.</p>

      <h3 class="text-xl font-bold mb-2 text-slate-800">3. Preveja Taxas de Alteração</h3>
      <p class="mb-4">O cliente pediu mais uma alteração depois da aprovação final? Seu contrato deve prever que isso gera um custo extra.</p>

      <h3 class="text-xl font-bold mb-2 text-slate-800">4. Propriedade Intelectual</h3>
      <p class="mb-4">Deixe claro quando os direitos sobre o trabalho são transferidos. Geralmente, isso só deve ocorrer após o pagamento integral.</p>

      <h3 class="text-xl font-bold mb-2 text-slate-800">5. Foro de Eleição</h3>
      <p class="mb-4">Defina onde eventuais disputas serão resolvidas. De preferência, na sua cidade de residência.</p>
    `,
    author: 'Carlos Silva',
    date: '05 Nov 2023',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'contrato-arrendamento',
    title: 'Cuidados ao Arrendar um Imóvel: O que Verificar',
    excerpt: 'Vai alugar uma casa ou escritório? Saiba o que deve constar no contrato para evitar dores de cabeça futuras.',
    content: `
      <p class="mb-4">O mercado imobiliário requer atenção aos detalhes. Um contrato de arrendamento mal feito pode resultar em despejos difíceis ou prejuízos com a conservação do imóvel.</p>
      
      <h3 class="text-xl font-bold mb-2 text-slate-800">Vistoria Inicial</h3>
      <p class="mb-4">Anexe ao contrato um laudo de vistoria com fotos. Isso prova como o imóvel foi entregue e como deve ser devolvido.</p>

      <h3 class="text-xl font-bold mb-2 text-slate-800">Índice de Reajuste</h3>
      <p class="mb-4">Em economia inflacionária, é crucial definir como e quando o aluguel será reajustado. Evite surpresas para ambas as partes.</p>

      <h3 class="text-xl font-bold mb-2 text-slate-800">Benfeitorias</h3>
      <p class="mb-4">Se o inquilino reformar a casa, ele será reembolsado? Ou a reforma fica para o proprietário? Essa cláusula é fonte frequente de brigas se não estiver escrita.</p>
    `,
    author: 'Imobiliária Confiança',
    date: '20 Jan 2024',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
  }
];