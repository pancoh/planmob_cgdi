import { MOCK_PREFEITURAS } from '@/lib/mock-data';

export default function PrefeiturasPage() {
  return (
    <>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 28 }}>Prefeituras</h2>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Município</th>
              <th>UF</th>
              <th>Código IBGE</th>
              <th>Status</th>
              <th>Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PREFEITURAS.map((pref) => (
              <tr key={pref.id}>
                <td style={{ fontWeight: 600 }}>{pref.name}</td>
                <td>{pref.uf}</td>
                <td style={{ color: 'var(--text-muted)' }}>{pref.codigoIbge || '—'}</td>
                <td>
                  <span className={`badge ${pref.active ? 'badge-green' : 'badge-red'}`}>
                    {pref.active ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {new Date(pref.createdAt).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
