import { useEffect, useRef, useState } from "react";
import { firebaseConfigured } from "../firebase";
import { register, signIn, signInWithGoogle, startPhoneSignIn } from "../auth";

const friendlyError = (error) => {
	const messages = {
		"auth/invalid-credential": "Email or password is incorrect.",
		"auth/email-already-in-use": "An account already exists with this email.",
		"auth/weak-password": "Use a password with at least 6 characters.",
		"auth/invalid-phone-number": "Enter a valid phone number with country code.",
		"auth/too-many-requests": "Too many attempts. Please try again later.",
	};
	return messages[error?.code] || error?.message || "Authentication failed. Please try again.";
};

const Login = () => {
	const [mode, setMode] = useState("email");
	const [registerMode, setRegisterMode] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [phone, setPhone] = useState("");
	const [code, setCode] = useState("");
	const [confirmation, setConfirmation] = useState(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const recaptchaRef = useRef(null);

	useEffect(() => () => recaptchaRef.current?.clear(), []);

	const run = async (action) => {
		setBusy(true);
		setError("");
		try { await action(); } catch (authError) { setError(friendlyError(authError)); } finally { setBusy(false); }
	};

	const submitEmail = (event) => {
		event.preventDefault();
		run(() => registerMode ? register(name, email, password) : signIn(email, password));
	};

	const sendCode = (event) => {
		event.preventDefault();
		run(async () => {
			recaptchaRef.current?.clear();
			const result = await startPhoneSignIn(phone, "recaptcha-container");
			recaptchaRef.current = result.verifier;
			setConfirmation(result.confirmation);
		});
	};

	const verifyCode = (event) => {
		event.preventDefault();
		run(() => confirmation.confirm(code));
	};

	return <main className="auth-page">
		<section className="auth-panel">
			<div className="auth-mark">RS</div>
			<p className="auth-eyebrow">RAILWAY OPERATIONS PORTAL</p>
			<h1>Welcome to RailSahayata</h1>
			<p className="auth-subtitle">Sign in securely to manage maintenance and block planning.</p>
			{!firebaseConfigured && <div className="auth-warning">Firebase is not configured yet. Add the `VITE_FIREBASE_*` values in Vercel before using login.</div>}
			<div className="auth-tabs"><button className={mode === "email" ? "active" : ""} onClick={() => { setMode("email"); setError(""); }}>Email</button><button className={mode === "phone" ? "active" : ""} onClick={() => { setMode("phone"); setError(""); }}>Phone OTP</button></div>
			{mode === "email" ? <form className="auth-form" onSubmit={submitEmail}>
				{registerMode && <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" autoComplete="name" required />}
				<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" autoComplete="email" required />
				<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" autoComplete={registerMode ? "new-password" : "current-password"} required minLength="6" />
				<button className="auth-primary" disabled={busy || !firebaseConfigured}>{busy ? "Working..." : registerMode ? "Create account" : "Sign in"}</button>
				<button type="button" className="auth-google" onClick={() => run(signInWithGoogle)} disabled={busy || !firebaseConfigured}>Continue with Google</button>
				<button type="button" className="auth-link" onClick={() => setRegisterMode(!registerMode)}>{registerMode ? "Already have an account? Sign in" : "Create a new account"}</button>
			</form> : <form className="auth-form" onSubmit={confirmation ? verifyCode : sendCode}>
				<input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number, e.g. +91 9876543210" autoComplete="tel" required disabled={Boolean(confirmation)} />
				{confirmation && <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="6-digit OTP" inputMode="numeric" autoComplete="one-time-code" required />}
				<button className="auth-primary" disabled={busy || !firebaseConfigured}>{busy ? "Working..." : confirmation ? "Verify OTP" : "Send OTP"}</button>
				<div id="recaptcha-container" />
			</form>}
			{error && <p className="auth-error">{error}</p>}
			<small className="auth-note">Authentication is handled by Firebase. Your password and OTP are never stored by RailSahayata.</small>
		</section>
	</main>;
};

export default Login;
