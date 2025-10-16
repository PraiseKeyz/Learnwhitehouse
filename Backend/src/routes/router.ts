import authRouter from './authRouter';
import courseRouter from './courseRouter';
import chatsRouter from './chatRouter';


const routes = {
  '/auth': authRouter,
  '/course': courseRouter,
  '/chat': chatsRouter,
};

export default routes;