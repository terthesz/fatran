import {
  AuthError,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

const signIn = async (email: string, passwd: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(getAuth(), email, passwd)
      .then((credentials: UserCredential) => {
        const user = credentials.user;

        resolve(user);
      })
      .catch((error: AuthError) => {
        const { code } = error;

        reject(code.split('/')[1]);
      });
  });
};

const register = async (
  email: string,
  passwd: string,
  name: string,
  surname: string
): Promise<User> => {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(getAuth(), email, passwd)
      .then(async (credentials) => {
        const { user } = credentials;

        // TODO: Maybe store in Realtime DB if other values are needed.
        await updateProfile(user, {
          displayName: `${name}_${surname}`,
        });

        resolve(user);
      })
      .catch((error: AuthError) => {
        const { code } = error;

        reject(code.split('/')[1]);
      });
  });
};

export { signIn, register };
