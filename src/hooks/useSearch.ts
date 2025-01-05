import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

interface useSearchProps<TRequest extends FieldValues, TResponse> {
    defaultValue: TResponse;
    searchServerAction: (requestBody: TRequest) => Promise<TResponse>;
}
const useSearch = <TRequest extends FieldValues, TResponse>(
    props: useSearchProps<TRequest, TResponse>
) => {
    const { defaultValue, searchServerAction } = props;
    const form = useForm<TRequest>();
    const [results, setResults] = useState<TResponse | undefined>(defaultValue);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>();
    const search = form.handleSubmit(async (data: TRequest) => {
        setIsLoading(true);
        setError(undefined);
        setResults(undefined);
        try {
            const searchResults = await searchServerAction(data);
            setResults(searchResults);
        } catch (err) {
            setError("failed");
        } finally {
            setIsLoading(false);
        }
    });
    return { form, search, results, isLoading, error };
};
export default useSearch;
