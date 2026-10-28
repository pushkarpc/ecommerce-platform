import { useLoginMutation } from '../api/loginApiSlice';
import amazonlogo from '../assets/images.png';
export const LoginComponent: React.FC = () => {
  const [login, { isLoading, error }] = useLoginMutation();
  if (isLoading) {
  }
  if (error) {
    const errorMessage = 'data' in error && (error.data as any)?.message;
    const errorStatusCode = 'status' in error && (error.status as any);
    return (
      <div className="flex flex-col  items-center justify-center h-screen">
        {errorStatusCode}: {errorMessage}
      </div>
    );
  }

  async function userAuthorization(email: string) {
    const userObject = { email: email };
    await login(userObject).unwrap();
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <img className="h-auto w-24 self-center" src={amazonlogo} alt="Amazon logo" />
        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            userAuthorization(String(formData.get('emailId')));
          }}
        >
          <h1 className="text-2xl font-medium">Sign in</h1>
          <p className="text-md">Continue to your amazon account</p>

          <label className="pt-4 text-sm" htmlFor="email" id="emailLabel">
            Email
          </label>
          <input
            className="w-full rounded-lg p-2 pl-3 border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-300"
            type="email"
            placeholder="you@example.com"
            name="emailId"
            id="email"
          />
          <button disabled={isLoading} className="w-full mt-2 rounded-lg bg-sky-400 py-2 text-white" type="submit">
            Submit
          </button>
        </form>
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-gray-300" />
          <span className="whitespace-nowrap">or continue with</span>
          <span className="h-px flex-1 bg-gray-300" />
        </div>
        <div className="flex justify-center gap-4">
          <span>Google</span>
          <span>Github</span>
          <span>LinkedIn</span>
        </div>
      </div>
    </div>
  );
};
