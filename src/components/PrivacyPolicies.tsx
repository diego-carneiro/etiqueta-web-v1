export default function PrivacyPolicies() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto bg-white p-12 shadow-lg rounded-md font-serif text-gray-800">

        <h1 className="text-2xl font-bold text-center mb-8">
          Política de Privacidade – Parceiros e Lojas (Etiqueta Digital)
        </h1>

        <p className="text-[15px] leading-7 text-justify mb-6">
          A UnionX BI, proprietária do sistema Etiqueta Digital, assume o compromisso
          de proteger a privacidade e os dados das Lojas Parceiras e de seus colaboradores.
          Esta política explica como as informações são tratadas em nossa plataforma
          de acordo com a legislação vigente (LGPD).
        </p>

        {/* 1 */}
        <h2 className="text-lg font-semibold mt-10 mb-4">
          1. Informações Coletadas da Loja
        </h2>

        <p className="text-[15px] leading-7 text-justify mb-4">
          Para a manutenção da parceria e funcionamento pleno do ecossistema, coletamos:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-[15px] leading-7 text-justify">
          <li>
            <strong>Dados Empresariais:</strong> CNPJ, Razão Social, Nome Fantasia,
            endereço comercial, e-mail e telefone.
          </li>
          <li>
            <strong>Dados de Visibilidade:</strong> Localização geográfica, horários de
            funcionamento e serviços prestados (exibidos aos motoristas para facilitar
            a localização da loja).
          </li>
          <li>
            <strong>Dados Financeiros:</strong> Informações necessárias para o faturamento
            das mensalidades e consumo de etiquetas.
          </li>
        </ul>

        {/* 2 */}
        <h2 className="text-lg font-semibold mt-10 mb-4">
          2. Dados dos Colaboradores (Funcionários)
        </h2>

        <p className="text-[15px] leading-7 text-justify mb-4">
          A Loja Parceira realiza o cadastro de seus colaboradores através do seu
          Painel Web Admin. Sobre esses dados, estabelecemos que:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-[15px] leading-7 text-justify">
          <li>
            <strong>Finalidade:</strong> Coletamos nome e identificação de acesso
            para permitir o uso do App de Funcionário.
          </li>
          <li>
            <strong>Auditoria e Segurança:</strong> O sistema registra automaticamente
            qual colaborador realizou cada lançamento de etiqueta digital.
            Este registro é permanente e visa a segurança jurídica da Loja,
            do Motorista e da UnionX BI.
          </li>
          <li>
            <strong>Responsabilidade da Loja:</strong> A Loja Parceira declara possuir
            a base legal necessária para compartilhar os dados de seus funcionários
            com a plataforma, garantindo que eles estejam cientes do registro
            de suas atividades técnicas no sistema.
          </li>
        </ul>

        {/* 3 */}
        <h2 className="text-lg font-semibold mt-10 mb-4">
          3. Inteligência de Mercado e Business Intelligence (BI)
        </h2>

        <p className="text-[15px] leading-7 text-justify mb-4">
          A UnionX BI utiliza os dados técnicos das manutenções lançadas
          (tipos de peças, serviços, modelos de veículos e frequências) para:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-[15px] leading-7 text-justify">
          <li>Gerar relatórios estatísticos e estudos de mercado automotivo.</li>
          <li>
            <strong>Anonimização:</strong> Todos os dados utilizados para fins de BI
            são processados de forma anonimizada, garantindo que não identifiquem
            motoristas ou indivíduos.
          </li>
          <li>
            <strong>Propriedade:</strong> Os relatórios e a inteligência derivada
            desses dados são de propriedade exclusiva da UnionX BI.
          </li>
        </ul>

        {/* 4 */}
        <h2 className="text-lg font-semibold mt-10 mb-4">
          4. Compartilhamento e Exibição de Dados
        </h2>

        <ul className="list-disc pl-6 space-y-2 text-[15px] leading-7 text-justify">
          <li>
            <strong>Com Motoristas:</strong> Exibição do perfil da loja,
            contato e localização para atração de novos clientes.
          </li>
          <li>
            <strong>Com Provedores de Serviço:</strong> Armazenamento seguro
            em nuvem através da AWS (Amazon Web Services).
          </li>
          <li>
            <strong>Sigilo:</strong> A UnionX BI não comercializa listas de contatos
            ou dados financeiros das lojas para terceiros.
          </li>
        </ul>

        {/* 5 */}
        <h2 className="text-lg font-semibold mt-10 mb-4">
          5. Segurança da Informação
        </h2>

        <p className="text-[15px] leading-7 text-justify mb-4">
          Implementamos medidas rígidas de segurança, como criptografia e controle
          de acesso por níveis, para garantir que os dados das lojas e os registros
          de manutenção permaneçam protegidos contra acessos não autorizados ou vazamentos.
        </p>

        {/* 6 */}
        <h2 className="text-lg font-semibold mt-10 mb-4">
          6. Contato e Alterações
        </h2>

        <p className="text-[15px] leading-7 text-justify mb-4">
          A Loja Parceira deve manter os dados de seus colaboradores atualizados,
          inativando perfis de funcionários desligados imediatamente.
        </p>

        <p className="text-[15px] leading-7 text-justify">
          Para dúvidas sobre o tratamento de dados, utilize nosso canal oficial:
          <br />
          <strong>E-mail:</strong> suporte@unionxbi.com
        </p>

      </div>
    </div>
  );
}