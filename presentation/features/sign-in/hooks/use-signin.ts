// import { useAuth } from "@/presentation/context/auth-context";
// import { AuthRepository } from "@/data/repository/auth-repository";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "expo-router";

// export const useSignIn = () => {
//   const router = useRouter();
//   const { login } = useAuth();

//   return useMutation({
//     mutationFn: (data: { username: string; password: string }) => {
//       return AuthRepository.login(data.username, data.password);
//     },
//     onSuccess: (data) => {
//       // Handle success - e.g., store token or navigate
//       console.log("Login successful", data);

//       login(data.token);
//       router.push("/home");
//     },
//     onError: (error: Error) => {
//       console.error("Login failed", error.message);
//     },
//   });
// };
