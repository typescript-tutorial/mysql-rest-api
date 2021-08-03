import {Request, Response} from 'express';
import { User } from 'models/User';
import {UserService} from '../services/UserService';

export class UserController {
  constructor(private userService: UserService) {
    this.all = this.all.bind(this);
    this.load = this.load.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.insertMany = this.insertMany.bind(this);
  }

  all(req: Request, res: Response) {
    this.userService.all()
      .then(users => res.status(200).json(users))
      .catch(err => res.status(500).send(err));
  }
  load(req: Request, res: Response) {
    const id = req.params['id'];
    if (!id || id.length === 0) {
      return res.status(400).send('id cannot be empty');
    }
    this.userService.load(id)
      .then(user => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json(null);
        }
      })
      .catch(err => res.status(500).send(err));
  }
  insert(req: Request, res: Response) {
    const user = req.body;
    this.userService.insert(user)
      .then(result => res.status(200).json(result))
      .catch(err => res.status(500).send(err));
  }
  update(req: Request, res: Response) {
    const id = req.params['id'];
    if (!id || id.length === 0) {
      return res.status(400).send('id cannot be empty');
    }
    const user = req.body;
    if (!user.id) {
      user.id = id;
    } else if (id !== user.id) {
      return res.status(400).send('body and url are not matched');
    }
    this.userService.update(user)
      .then(result => res.status(200).json(result))
      .catch(err => res.status(500).send(err));
  }
  delete(req: Request, res: Response) {
    const id = req.params['id'];
    if (!id || id.length === 0) {
      return res.status(400).send('id cannot be empty');
    }
    this.userService.delete(id)
      .then(result =>{
        
        if(result > 0){
          return res.status(200).json(result);
        }
        else{
          res.status(400).send('User not exist')
        }
      })
      .catch(err => res.status(500).send(err));
  }
  insertMany(req: Request, res: Response){
    const users: User[] = [{
      id: "1",
      username: "tony.stark",
      email: "tony.stark@gmail.com",
    },
    {
      id: "2",
      username: "peter.parker",
      email: "peter.parker@gmail.com",
    },
    {
      id: "2",
      username: "james.howlett",
      email: "james.howlett@gmail.com",
    },
    {
      id: "4",
      username: "james.howlett",
      email: "james.howlett@gmail.com",
    }]
    this.userService.transaction(users)
      .then(result => res.status(200).json(result))
      .catch(err => res.status(500).send(err));
  }
}
