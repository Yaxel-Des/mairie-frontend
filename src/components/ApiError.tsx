type ApiErrorProps = {
  message: string;
};

export default function ApiError({ message }: ApiErrorProps) {
  return (
    <p className="todo-note my-8" role="alert">
      {message}
    </p>
  );
}
