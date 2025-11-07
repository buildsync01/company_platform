'use client';

import { useActionState } from 'react';
import { createCompany } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const initialState = {
    error: null,
    fieldErrors: {},
};

export function CreateCompanyForm() {
    const [state, formAction] = useActionState(createCompany, initialState);

    return (
        <Card className="w-full max-w-2xl mx-auto bg-[#222222] border-[#2d2d2d]">
            <form action={formAction}>
                <CardHeader>
                    <CardTitle>Add Your Company Information</CardTitle>
                    <CardDescription>Create a company profile to start adding products and be discovered by buyers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input 
                                id="companyName" 
                                name="companyName" 
                                placeholder="e.g., Acme Inc."
                                required 
                            />
                            {state?.fieldErrors?.companyName && <p className="text-red-500 text-sm">{state.fieldErrors.companyName}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Company Email (Optional)</Label>
                            <Input 
                                id="email" 
                                name="email" 
                                type="email"
                                placeholder="contact@example.com" 
                            />
                            {state?.fieldErrors?.email && <p className="text-red-500 text-sm">{state.fieldErrors.email}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slogan">Slogan (Optional)</Label>
                        <Input 
                            id="slogan" 
                            name="slogan" 
                            placeholder="e.g., Quality products, guaranteed"
                        />
                        {state?.fieldErrors?.slogan && <p className="text-red-500 text-sm">{state.fieldErrors.slogan}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone (Optional)</Label>
                            <Input 
                                id="phone" 
                                name="phone" 
                                placeholder="+1234567890"
                            />
                            {state?.fieldErrors?.phone && <p className="text-red-500 text-sm">{state.fieldErrors.phone}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Website (Optional)</Label>
                            <Input 
                                id="website" 
                                name="website" 
                                placeholder="https://example.com" 
                            />
                            {state?.fieldErrors?.website && <p className="text-red-500 text-sm">{state.fieldErrors.website}</p>}
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="companySize">Company Size (Optional)</Label>
                            <Input 
                                id="companySize" 
                                name="companySize" 
                                placeholder="e.g., 10-50 employees"
                            />
                            {state?.fieldErrors?.companySize && <p className="text-red-500 text-sm">{state.fieldErrors.companySize}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="establishedYear">Year Established (Optional)</Label>
                            <Input 
                                id="establishedYear" 
                                name="establishedYear" 
                                placeholder="e.g., 2005"
                            />
                            {state?.fieldErrors?.establishedYear && <p className="text-red-500 text-sm">{state.fieldErrors.establishedYear}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category (Optional)</Label>
                        <Input 
                            id="category" 
                            name="category" 
                            placeholder="e.g., Construction, Electronics"
                        />
                        {state?.fieldErrors?.category && <p className="text-red-500 text-sm">{state.fieldErrors.category}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="about">About (Optional)</Label>
                        <Textarea 
                            id="about" 
                            name="about" 
                            placeholder="Tell us a little bit about your company" 
                        />
                        {state?.fieldErrors?.about && <p className="text-red-500 text-sm">{state.fieldErrors.about}</p>}
                    </div>
                    {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit">Create Company</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
