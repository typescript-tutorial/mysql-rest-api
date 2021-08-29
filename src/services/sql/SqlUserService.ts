import {Pool} from 'mysql';
import {User} from '../../models/User';
import {buildToSave, buildToSaveBatch} from './build';
import {Model} from './metadata';
import {exec, execBatch, query, queryOne, StringMap, StringService} from './mysql';

export const userModel: Model = {
  name: 'user',
  attributes: {
    id: {
      key: true,
      match: 'equal'
    },
    username: {
      match: 'contain'
    },
    email: {
      format: 'email',
      required: true
    },
    phone: {
      format: 'phone',
      default: '123',
      required: true
    },
    age: {
      type: 'number'
    },
    active: {
      type: 'boolean',
      true: 'A',
      false: 'I'
    },
    version: {
      type: 'integer',
      version: true
    },
    dateOfBirth: {
      type: 'datetime',
      field: 'date_of_birth'
    }
  }
};
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
    /*
    const arr = [
      {id': 'ironman', 'username': 'tony.stark', 'email': 'tony.stark@gmail.com', 'phone': null, 'dateOfBirth': new Date('1963-03-25T00:00:00+07:00'), age: 1, active: true, version: 2},
      {'id': 'spiderman', 'username': 'peter.parker', 'email': null, 'phone': '0987654321', 'dateOfBirth': new Date('1962-08-25T00:00:00+07:00'), age: 15, active: false, version: 1},
      {'id': 'wolverine', 'username': 'james.howlett', 'email': 'james.howlett@gmail.com', 'phone': '0987654321', 'dateOfBirth': new Date('1974-11-16T00:00:00+07:00'), age: 20, active: true}
    ];
    cons'ole.log('start');
    const st = new StringService(this.pool, 'skills', 'skill');
    return st.load('j', 1).then(r => {
      console.log(JSON.stringify(r));
      return 1;
    });
    /*
    const stmt = buildToSaveBatch(arr, 'users2', userModel.attributes);
    console.log('q ' + JSON.stringify(stmt));
    return execute(this.pool, stmt);
    */
    return exec(this.pool, `insert into users (id, username, email, phone) values (?, ?, ?, ?)`,
     [user.id, user.username, user.email, user.phone]);
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
      return { query: `insert into users3 (id, username, email) values (?, ?, ?);`, args: [item.id, item.username, item.email] };
      //  return { query: `REPLACE INTO users (id, username, email) values(?, ?, ?);`, args: [item.id, item.username, item.email] };
    });
    return execBatch(this.pool, statements);
  }
}
