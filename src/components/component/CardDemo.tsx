import { Button } from "../ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    // CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
interface InputDispatchProps {
    name?: string,
    email?: string,
    password?: string,
    error?: string,
    setName?: React.Dispatch<React.SetStateAction<string>>
    setEmail?: React.Dispatch<React.SetStateAction<string>>
    setPassword?: React.Dispatch<React.SetStateAction<string>>
    handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}
export function CardDemo({ name, email, password,error, setName, setEmail, setPassword, handleSubmit}: InputDispatchProps) {
    return (
        <Card className="border-none w-full bg-black text-white max-w-sm">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
                <CardAction>
                    <Button variant="link">Sign Up</Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Name</Label>
                            <Input
                                id="Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName && setName(e.target.value)}
                                placeholder="Itemmerial"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail && setEmail(e.target.value)}
                                placeholder="temmerial@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input
                                value={password}
                                id="password"
                                type="password"
                                onChange={(e) => setPassword && setPassword(e.target.value)}
                                required />
                        </div>
                    </div>
                    <div>{error && <div>{error}</div>}</div>
                    <Button type="submit" className="flex-col gap-2 w-full" >
                    Login
                </Button>
                </form>

            </CardContent>
            {/* <CardFooter className="flex-col gap-2"> */}
                
                {/* <Button variant="outline" className="w-full">
                    Login with Google
                </Button> */}
            {/* </CardFooter> */}
        </Card>
    )
}
