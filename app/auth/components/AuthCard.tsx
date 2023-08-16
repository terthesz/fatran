const AuthCard = ({ children }: any) => {
  return (
    <div className="sm:border-2 rounded-3xl grid place-items-center sm:px-[2rem] py-[1.8rem] w-auto text-gray-800 text-center">
      {children}
    </div>
  );
};

export default AuthCard;
