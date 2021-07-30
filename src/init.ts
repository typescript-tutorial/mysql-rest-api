import {Pool} from 'mysql';
import {ApplicationContext} from './context';
import {UserController} from './controllers/UserController';
import {SqlUserService} from './services/sql/SqlUserService';

export function createContext(pool: Pool): ApplicationContext {
  const userService = new SqlUserService(pool);
  const userController = new UserController(userService);
  const ctx: ApplicationContext = {userController};
  return ctx;
}
