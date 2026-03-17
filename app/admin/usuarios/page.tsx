import { MOCK_USERS } from '@/lib/mock-data';
import { ROLES } from '@/lib/constants/perfis';

export default function UsuariosPage() {
  return (
    <>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 28 }}>Usuários</h2>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Prefeitura</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((user) => (
              <tr key={user.id}>
                <td style={{ fontWeight: 600 }}>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="badge badge-blue">{ROLES[user.role].label}</span>
                </td>
                <td>{user.prefeituraName}</td>
                <td>
                  <span className={`badge ${user.active ? 'badge-green' : 'badge-red'}`}>
                    {user.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
