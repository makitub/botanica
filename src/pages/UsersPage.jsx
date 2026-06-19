import React from 'react';
import { USERS_MOCK, ROLES } from '../constants';
import PageShell from '../components/layout/PageShell';
import Badge from '../components/ui/Badge';
import styles from './UsersPage.module.css';

const TONE_MAP = { admin: 'safe', tecnico: 'gold', paciente: 'primary' };

export default function UsersPage() {
  return (
    <PageShell icon="◈" title="Utilizadores" subtitle="Gestão de contas — acesso exclusivo de administradores">
      <div className={styles.list}>
        {USERS_MOCK.map((u) => {
          const roleInfo = ROLES[u.role];
          return (
            <div key={u.id} className={styles.row}>
              <span className={styles.avatar} style={{ background: roleInfo?.accent }}>{u.initials}</span>
              <div className={styles.info}>
                <p className={styles.name}>{u.name}</p>
                <p className={styles.email}>{u.email}</p>
              </div>
              <Badge tone={TONE_MAP[u.role] || 'neutral'}>{roleInfo?.label || u.role}</Badge>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
