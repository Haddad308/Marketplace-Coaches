'use client';

import { ChevronDown, Eye, EyeOff, User } from 'lucide-react';
import { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';

type AuthStep = 'email' | 'signin' | 'signup';

type ValidationError = {
	email?: string;
	password?: string;
	name?: string;
	response?: string;
};

type Touched = {
	email?: boolean;
	password?: boolean;
	name?: boolean;
	response?: boolean;
};

export function SignInModal() {
	const { signUp, signIn, signInWithGoogle } = useAuth();

	const [isOpen, setIsOpen] = useState(false);
	const [step, setStep] = useState<AuthStep>('email');
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		name: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<ValidationError | null>({
		email: 'Email is required.',
		password: 'Password is required.',
		name: 'Name is required.',
		response: undefined,
	});
	const [touched, setTouched] = useState<Touched | null>(null);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setError((prev) => ({ ...prev, response: '' }));

		// Always update the form data first

		setFormData((prev) => ({ ...prev, [name]: value }));

		const fieldError: ValidationError = {};

		if (name === 'email') {
			if (!value) {
				fieldError.email = 'Email is required.';
			} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
				fieldError.email = 'Enter a valid email address.';
			}
		}

		if (name === 'password') {
			if (!value) {
				fieldError.password = 'Password is required.';
			} else if (value.length < 6) {
				fieldError.password = 'Password must be at least 6 characters.';
			}
		}

		if (name === 'name') {
			if (!value.trim()) {
				fieldError.name = 'Name is required.';
			}
		}

		if (Object.keys(fieldError).length > 0) {
			setError((prev) => ({ ...prev, ...fieldError }));
		} else {
			setError((prev) => ({ ...prev, [name]: '' }));
		}
	};

	const handleTouched = (fieldName: string) => {
		setTouched((prev) => ({ ...prev, [fieldName]: true }));
	};

	const handleEmailContinue = async () => {
		setIsLoading(true);
		try {
			// Try to create a user with a temporary password to check if email exists
			await signUp(formData.email, 'temp_password_for_check');
			// If successful, email doesn't exist, proceed to signup
			setStep('signup');
			setTouched(null);
			setError((prev) => ({ ...prev, response: '' }));
		} catch (err: unknown) {
			if (err instanceof Error && err.message.includes('email-already-in-use')) {
				// Email exists, proceed to signin
				setStep('signin');
				setTouched(null);
				setError((prev) => ({ ...prev, response: '' }));
			} else {
				// Other error occurred
				const message = err instanceof Error ? err.message : 'Something went wrong.';
				setError({ response: message });
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignIn = async () => {
		setIsLoading(true);
		try {
			await signIn(formData.email, formData.password);
			setIsOpen(false);
			setTouched(null);
		} catch (err: unknown) {
			if (err instanceof Error && err.message.includes('auth/invalid-credential')) {
				setError({ response: 'Email and password do not match.' });
			} else if (err instanceof Error) {
				setError({ response: err.message });
			} else {
				setError({ response: 'Failed to sign in.' });
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignUp = async () => {
		setIsLoading(true);
		try {
			await signUp(formData.email, formData.password);
		} catch (err: unknown) {
			if (err instanceof Error && err.message.includes('email-already-in-use')) {
				setError({ response: 'This email is already in use.' });
			} else if (err instanceof Error) {
				setError({ response: err.message || 'Failed to sign up.' });
			} else {
				setError({ response: 'Failed to sign up.' });
			}
		} finally {
			setIsLoading(false);
		}
	};

	const resetForm = () => {
		setStep('email');
		setFormData({ email: '', password: '', name: '' });
		setShowPassword(false);
		setError((prev) => ({ ...prev, email: 'Email is required.', response: '' }));
		setTouched(null);
	};

	const renderError = (field: keyof ValidationError) => {
		return touched?.[field] && error?.[field] ? <div className="mt-1 text-sm text-red-600">{error[field]}</div> : null;
	};

	const renderResponseError = () => {
		return error?.response ? <div className="mt-3 text-center text-sm text-red-600">{error.response}</div> : null;
	};

	return (
		<DropdownMenu
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);
				resetForm();
			}}
		>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="flex items-center space-x-2 rounded-full border-gray-300 px-4 py-2 hover:border-purple-500"
				>
					<User className="h-4 w-4" />
					<span>Sign In</span>
					<ChevronDown className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-96 border-none bg-white p-0">
				<div className="p-6">
					{step === 'email' && (
						<>
							<h2 className="mb-2 text-center text-2xl font-bold text-gray-900">Welcome to DealSpot</h2>
							<p className="mb-6 text-center text-gray-600">Access all DealSpot has to offer</p>

							<Button
								variant="outline"
								className="mb-4 flex w-full items-center justify-center space-x-3 border-gray-300 py-3 hover:bg-gray-50"
								onClick={signInWithGoogle}
							>
								<FaGoogle className="h-5 w-5 text-red-500" />
								<span>Continue with Google</span>
							</Button>

							<div className="mb-4 text-center text-gray-500">Or sign in with email</div>

							<Input
								name="email"
								type="email"
								placeholder="Email"
								value={formData.email}
								onChange={handleInputChange}
								className="w-full rounded-md border-gray-300 py-3"
								onBlur={() => handleTouched('email')}
								onInput={() => handleTouched('email')}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										if (formData.email && !error?.email) {
											handleEmailContinue();
										}
									}
								}}
							/>
							{renderError('email')}

							<Button
								onClick={handleEmailContinue}
								disabled={!touched?.email || !!error?.email || isLoading}
								className="mt-4 w-full rounded-full bg-purple-600 py-3 font-medium text-white hover:bg-purple-700"
							>
								{isLoading ? 'Loading...' : 'Continue'}
							</Button>

							{renderResponseError()}
						</>
					)}

					{step === 'signin' && (
						<>
							<div className="mb-4 flex items-center justify-between rounded-md bg-gray-100 p-3">
								<span className="text-sm text-gray-700">{formData.email}</span>
								<Button variant="link" className="h-auto p-0 text-sm text-purple-600" onClick={resetForm}>
									Change
								</Button>
							</div>

							<Label htmlFor="password" className="text-sm font-medium text-gray-700">
								Password
							</Label>
							<div className="relative">
								<Input
									id="password"
									name="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="Password"
									value={formData.password}
									onChange={handleInputChange}
									className="w-full rounded-md border-gray-300 py-3 pr-10"
									onBlur={() => handleTouched('password')}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											if (formData.password && !error?.password) {
												handleSignIn();
											}
										}
									}}
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute top-1/2 right-2 h-auto -translate-y-1/2 transform p-1"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</Button>
							</div>
							{renderError('password')}

							<Button
								onClick={handleSignIn}
								disabled={!formData.password || !!error?.password || isLoading}
								className="mt-4 w-full rounded-full bg-purple-600 py-3 font-medium text-white hover:bg-purple-700"
							>
								{isLoading ? 'Signing In...' : 'Sign In'}
							</Button>

							{renderResponseError()}
						</>
					)}

					{step === 'signup' && (
						<>
							<div className="mb-4 flex items-center justify-between rounded-md bg-gray-100 p-3">
								<span className="text-sm text-gray-700">{formData.email}</span>
								<Button variant="link" className="h-auto p-0 text-sm text-purple-600" onClick={resetForm}>
									Change
								</Button>
							</div>

							<Label htmlFor="name" className="text-sm font-medium text-gray-700">
								Your name
							</Label>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="Name"
								value={formData.name}
								onChange={handleInputChange}
								className="mt-1 w-full rounded-md border-gray-300 py-3"
								onBlur={() => handleTouched('name')}
							/>
							{renderError('name')}

							<Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
								Create a password
							</Label>
							<div className="relative">
								<Input
									id="signup-password"
									name="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="Password"
									value={formData.password}
									onChange={handleInputChange}
									className="w-full rounded-md border-gray-300 py-3 pr-10"
									onBlur={() => handleTouched('password')}
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute top-1/2 right-2 h-auto -translate-y-1/2 transform p-1"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</Button>
							</div>
							{renderError('password')}

							<Button
								onClick={handleSignUp}
								disabled={!formData.name || !formData.password || isLoading}
								className="mt-4 w-full rounded-full bg-purple-600 py-3 font-medium text-white hover:bg-purple-700"
							>
								{isLoading ? 'Creating Account...' : 'Sign Up'}
							</Button>

							{renderResponseError()}
						</>
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
