import {Pool} from 'mysql';
import {User} from '../../models/User';
import {exec, execute, query, queryOne, StringMap} from './mysql';

export const dateMap: StringMap = {
  date_of_birth: 'dateOfBirth',
};
export class SqlUserService {
  constructor(private pool: Pool) {
  }
  all(): Promise<User[]> {
    return query<User>(this.pool, 'SELECT * FROM users ORDER BY id ASC', undefined, dateMap);
  }
  load(id: string): Promise<User> {
    return queryOne(this.pool, 'SELECT * FROM users WHERE id = ?', [id], dateMap);
  }
  insert(user: User): Promise<number> {
    return exec(this.pool, `INSERT INTO users (id, username, email, phone, date_of_birth) VALUES (?, ?, ?, ?, ?)`,
     [user.id, user.username, user.email, user.phone, user.dateOfBirth]);
  }
  update(user: User): Promise<number> {
    return exec(this.pool, `UPDATE users SET username=?, email=?, phone=?, date_of_birth= ? WHERE id = ?`,
     [user.username, user.email, user.phone, user.dateOfBirth, user.id]);
  }
  delete(id: string): Promise<number> {
    return exec(this.pool, `DELETE FROM users WHERE id = ?`, [id]);
  }
  transaction(users: User[]): Promise<number>{
    const statements = users.map((item) => {
      return { query: `INSERT INTO users (id, username, email) VALUES (?,?,?);`, args: [item.id, item.username, item.email] };
      //  return { query: `REPLACE INTO users (id, username, email) VALUES(?, ?, ?);`, args: [item.id, item.username, item.email] };
    });
    return execute(this.pool, statements);
  }
}
