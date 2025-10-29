import authRouter from './authRouter';
import courseRouter from './courseRouter';
import chatsRouter from './chatRouter';
import userRouter from './userRouter';


const routes = {
  '/auth': authRouter,
  '/course': courseRouter,
  '/chat': chatsRouter,
  '/users': userRouter,
};

export default routes;