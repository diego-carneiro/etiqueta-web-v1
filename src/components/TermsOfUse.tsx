export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-brand-light py-12">
      <div className="max-w-4xl mx-auto bg-white p-12 shadow-lg rounded-md text-brand-black">

        {/* TÍTULO */}
        <h1 className="text-2xl font-extrabold text-brand text-center mb-8">
          Termos de Uso e Contrato de Parceria – Loja Parceira (Etiqueta Digital)
        </h1>

        {/* INTRODUÇÃO */}
        <p className="text-[15px] leading-7 text-justify mb-6">
          Este Contrato de Prestação de Serviços de Tecnologia regula a relação entre a UnionX BI
          (doravante "Plataforma"), inscrita no CNPJ sob o nº [INSERIR CNPJ], e o estabelecimento
          comercial cadastrado e aprovado no sistema (doravante "Loja Parceira").
        </p>

        {/* 1 */}
        <h2 className="text-lg font-bold text-brand-black mt-10 mb-4">
          1. Objeto e Funcionalidades
        </h2>

        <p className="text-[15px] leading-7 text-justify mb-4">
          A Plataforma disponibiliza à Loja Parceira o sistema Etiqueta Digital, cujas
          funcionalidades compreendem:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-[15px] leading-7 text-justify">
          <li>Consulta de etiquetas e histórico de precedência de veículos.</li>
          <li>Aprovação de cadastro de motoristas realizada exclusivamente pelo sistema.</li>
          <li>Geração de novas etiquetas digitais de manutenção preventiva.</li>
          <li>
            Exibição do perfil da loja, horários e dias de funcionamento para motoristas via
            geolocalização.
          </li>
        </ul>

        {/* 2 */}
        <h2 className="text-lg font-bold text-brand-black mt-10 mb-4">
          2. Responsabilidade Técnica, Qualidade e Ética
        </h2>

        <p className="text-[15px] leading-7 text-justify mb-4">
          <strong>Veracidade:</strong> A Loja Parceira é a única responsável técnica e jurídica
          pelos serviços prestados e pela exatidão das informações inseridas no sistema
          (peças, quilometragem e serviços).
        </p>

        <p className="text-[15px] leading-7 text-justify mb-4">
          <strong>Edição e Correções:</strong> A edição de uma etiqueta digital é permitida
          exclusivamente nas primeiras 24 horas após o seu lançamento. Identificado qualquer
          erro após este prazo, a loja deverá gerar uma nova etiqueta digital contendo as
          informações corretas.
        </p>

        <p className="text-[15px] leading-7 text-justify mb-4">
          <strong>Isenção de Responsabilidade:</strong> A UnionX BI atua como provedora de
          tecnologia e histórico, não possuindo responsabilidade por falhas mecânicas,
          garantias de peças, prazos ou a execução dos serviços pela Loja Parceira.
        </p>

        <p className="text-[15px] leading-7 text-justify mb-4">
          <strong>Padrão de Qualidade e Confiança:</strong> O Etiqueta Digital visa combater a má
          fama do setor e criar um ecossistema de confiança. Portanto:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-[15px] leading-7 text-justify mb-4">
          <li>
            Reclamações reiteradas de usuários sobre má qualidade ou condutas antiéticas
            serão monitoradas.
          </li>
          <li>
            Persistindo as reclamações após reunião de alinhamento com a UnionX BI,
            a plataforma reserva-se o direito de bloquear ou excluir permanentemente
            a loja, visando proteger a integridade do grupo e a segurança dos motoristas.
          </li>
        </ul>

        {/* 3 */}
        <h2 className="text-lg font-bold text-brand-black mt-10 mb-4">
          3. Propriedade de Dados e Business Intelligence (BI)
        </h2>

        <p className="text-[15px] leading-7 text-justify mb-4">
          <strong>Histórico Permanente:</strong> Os dados de manutenção lançados integram o
          banco de dados centralizado da Plataforma. Em caso de desativação ou saída da loja,
          as etiquetas já emitidas permanecem no sistema para garantir a continuidade da
          precedência do veículo.
        </p>

        <p className="text-[15px] leading-7 text-justify mb-4">
          <strong>Cláusula de BI:</strong> A Loja Parceira autoriza expressamente a UnionX BI
          a tratar os dados técnicos das manutenções de forma anonimizada. A UnionX BI
          detém a propriedade intelectual exclusiva sobre os relatórios estatísticos,
          estudos de mercado e inteligência de Business Intelligence (BI) gerados a partir
          da base de dados.
        </p>

        {/* 4 */}
        <h2 className="text-lg font-bold text-brand-black mt-10 mb-4">
          4. Gestão de Funcionários e Acessos
        </h2>

        <p className="text-[15px] leading-7 text-justify mb-4">
          <strong>Cadastro:</strong> A Loja Parceira é responsável por cadastrar e gerenciar
          seus colaboradores exclusivamente através do seu Painel Web Admin.
        </p>

        <p className="text-[15px] leading-7 text-justify mb-4">
          <strong>Uso Operacional:</strong> Após o cadastro no Web Admin, os colaboradores
          terão acesso ao sistema através do App de Funcionário.
        </p>

        <p className="text-[15px] leading-7 text-justify mb-4">
          <strong>Segurança:</strong> Toda manutenção identificará a Loja e o Funcionário
          responsável. Cabe à Loja inativar imediatamente o acesso de funcionários
          desligados via Painel Web, sendo a Loja integralmente responsável por qualquer
          lançamento realizado sob os perfis que ela gerencia.
        </p>

        {/* 5 */}
        <h2 className="text-lg font-bold text-brand-black mt-10 mb-4">
          5. Pagamento e Inadimplência
        </h2>

        <ul className="list-disc pl-6 space-y-2 text-[15px] leading-7 text-justify">
          <li><strong>Vencimento:</strong> Todo dia 10 (dez) de cada mês.</li>
          <li>
            <strong>Encargos:</strong> O atraso sujeitará a Loja à multa de 2% e juros
            de mora de 1% ao mês.
          </li>
          <li>
            <strong>Bloqueio:</strong> Após 30 dias de atraso sem regularização ou negociação,
            a Loja será bloqueada para gerar novas etiquetas até a quitação dos débitos.
          </li>
        </ul>

        {/* 6 */}
        <h2 className="text-lg font-bold text-brand-black mt-10 mb-4">
          6. Suporte Técnico
        </h2>

        <p className="text-[15px] leading-7 text-justify mb-4">
          A UnionX BI oferece suporte via e-mail (suporte@unionxbi.com), WhatsApp oficial
          e canais internos.
        </p>

        <p className="text-[15px] leading-7 text-justify mb-4">
          <strong>Prazo de Resposta:</strong> Até 12 (doze) horas úteis,
          buscando-se o atendimento imediato.
        </p>

        {/* 7 */}
        <h2 className="text-lg font-bold text-brand-black mt-10 mb-4">
          7. Promoções e Fidelidade
        </h2>

        <p className="text-[15px] leading-7 text-justify mb-4">
          As isenções temporárias para as primeiras 75 lojas parceiras serão aplicadas
          conforme o regulamento de adesão. Após o período de bonificação,
          a cobrança de mensalidade e consumo de etiquetas será iniciada automaticamente
          conforme a tabela vigente.
        </p>

        {/* 8 */}
        <h2 className="text-lg font-bold text-brand-black mt-10 mb-4">
          8. Disposições Gerais
        </h2>

        <p className="text-[15px] leading-7 text-justify">
          As partes elegem o foro da sede da UnionX BI para dirimir quaisquer
          controvérsias oriundas deste contrato.
        </p>

      </div>
    </div>
  );
}