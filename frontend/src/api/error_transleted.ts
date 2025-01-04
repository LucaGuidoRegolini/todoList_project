export function errorTranslated(error_message: string): string {
  switch (error_message) {
    case "Unauthorized":
      return "Usuário ou senha inválidos";
    default:
      return "Erro na requisição";
  }
}
