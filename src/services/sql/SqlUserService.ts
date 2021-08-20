import {Pool} from 'mysql';
import {User} from '../../models/User';
import {exec, execBatch, query, queryOne, StringMap} from './mysql';

export const dateMap: StringMap = {
  date_of_birth: 'dateOfBirth',
};
export class SqlUserService {
  constructor(private pool: Pool) {
  }
  all(): Promise<User[]> {
    return query<User>(this.pool, 'select * from users order by id ASC', undefined, dateMap);
  }
  load(id: string): Promise<User> {
    return queryOne(this.pool, 'select * from users where id = ?', [id], dateMap);
  }
  insert(user: User): Promise<number> {
    return exec(this.pool, `insert into users (id, username, email, phone, date_of_birth) values (?, ?, ?, ?, ?)`,
     [user.id, user.username, user.email, user.phone, user.dateOfBirth]);
  }
  update(user: User): Promise<number> {
    return exec(this.pool, `update users SET username=?, email=?, phone=?, date_of_birth= ? where id = ?`,
     [user.username, user.email, user.phone, user.dateOfBirth, user.id]);
  }
  delete(id: string): Promise<number> {
    return exec(this.pool, `delete from users where id = ?`, [id]);
  }
  transaction(users: User[]): Promise<number> {
    const statements = users.map((item) => {
      return { query: `insert into users (id, username, email) values (?, ?, ?);`, params: [item.id, item.username, item.email] };
      //  return { query: `REPLACE INTO users (id, username, email) values(?, ?, ?);`, args: [item.id, item.username, item.email] };
    });
    return execBatch(this.pool, statements, true);
  }
}
