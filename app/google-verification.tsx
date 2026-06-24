// Fichier: public/google-site-verification-XXXXX.html
// Remplacez XXXXX par votre code de vérification Google

const googleVerificationCode = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '';

export default function GoogleVerification() {
  return (
    <meta
      name="google-site-verification"
      content={googleVerificationCode}
    />
  );
}
