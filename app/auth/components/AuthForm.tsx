const AuthForm = ({ children, onSubmit }: any) => {
  return (
    <form
      id="auth-form"
      onSubmit={onSubmit}
      className="mt-[1.5rem] flex flex-col text-left items-center"
    >
      {children}
    </form>
  );
};

export default AuthForm;
