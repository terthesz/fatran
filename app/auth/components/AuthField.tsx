import { ChangeEventHandler, MutableRefObject } from 'react';

interface LoginFieldArgs {
  type?: string;
  id: string;
  placeholder: string;
  children: any;

  onChange?: ChangeEventHandler;
  fieldRef?: MutableRefObject<any>;
  wrapRef?: MutableRefObject<any>;
}

const AuthField = ({
  id,
  type = 'string',
  placeholder,
  children,
  onChange,
  fieldRef,
  wrapRef,
}: LoginFieldArgs) => {
  return (
    <div ref={wrapRef}>
      <label htmlFor="email">{children}</label>
      <input
        type={type}
        name={id}
        id={id}
        onChange={onChange}
        ref={fieldRef}
        placeholder={placeholder}
        className="mb-[1rem]"
      />
    </div>
  );
};

export default AuthField;
