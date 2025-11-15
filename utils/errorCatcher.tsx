// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function errorCatcher(error: any) {
  let errorMessage = "";
  switch (error?.code) {
    case "auth/email-already-in-use":
      errorMessage = "Adres email jest już używany.";
      break;
    case "auth/invalid-email":
      errorMessage = "Podany adres email jest nieprawidłowy.";
      break;
    case "auth/weak-password":
      errorMessage = "Hasło jest zbyt słabe.";
      break;
    case "auth/operation-not-allowed":
      errorMessage = "Ta operacja nie jest dozwolona.";
      break;
    case "auth/captcha-check-failed":
      errorMessage = "Weryfikacja reCAPTCHA nie powiodła się.";
      break;
    case "auth/user-not-found":
      errorMessage = "Nie znaleziono użytkownika o podanym adresie email.";
      break;
    case "auth/wrong-password":
      errorMessage = "Nieprawidłowe hasło.";
      break;
    case "auth/too-many-requests":
      errorMessage =
        "Zbyt wiele nieudanych prób logowania. Spróbuj ponownie później.";
      break;
    case "auth/user-disabled":
      errorMessage = "Twoje konto zostało wyłączone przez administratora.";
      break;
    case "auth/user-token-expired":
      errorMessage = "Sesja użytkownika wygasła. Zaloguj się ponownie.";
      break;
    case "auth/user-token-revoked":
      errorMessage = "Autoryzacja użytkownika została wycofana.";
      break;
    case "auth/expired-action-code":
      errorMessage = "Kod akcji wygasł.";
      break;
    case "auth/invalid-action-code":
      errorMessage = "Nieprawidłowy kod akcji.";
      break;
    case "auth/missing-password":
      errorMessage = "Proszę wprowadzić hasło.";
      break;
    case "auth/user-disabled":
      errorMessage = "Twoje konto zostało wyłączone przez administratora.";
      break;
    case "auth/invalid-custom-token":
      errorMessage = "Nieprawidłowy niestandardowy token.";
      break;
    case "auth/claims-too-large":
      errorMessage = "Za dużo danych w niestandardowych zezwoleniach.";
      break;
    case "auth/id-token-expired":
      errorMessage = "ID token wygasł.";
      break;
    case "auth/id-token-revoked":
      errorMessage = "ID token został odwołany.";
      break;
    case "auth/invalid-credential":
      errorMessage = "Podane uwierzytelnienie jest nieprawidłowe.";
      break;
    case "auth/missing-iframe-start":
      errorMessage = "Wewnętrzny błąd: Brak komunikatu rozpoczęcia.";
      break;
    case "auth/quota-exceeded":
      errorMessage = "Przekroczono limit operacji dla tego projektu.";
      break;
    case "auth/timeout":
      errorMessage = "Operacja wygasła. Spróbuj ponownie.";
      break;
    case "auth/credential-already-in-use":
      errorMessage =
        "To uwierzytelnienie jest już powiązane z innym kontem użytkownika.";
      break;
    case "auth/tenant-id-mismatch":
      errorMessage =
        "Podany identyfikator najemcy nie pasuje do identyfikatora najemcy usługi Auth.";
      break;
    default:
      errorMessage = "Wystąpił błąd uwierzytelniania.";
  }

  return errorMessage;
}
