namespace CodeLab;

// Adaptador explícito de E/S. El navegador no admite System.Console.ReadLine.
// Los archivos originales se compilan con un alias Console definido en los csproj.
public static class ConsoleAdapter
{
    public static TextReader In { get; set; } = OperatingSystem.IsBrowser() ? TextReader.Null : System.Console.In;
    public static TextWriter Out { get; set; } = OperatingSystem.IsBrowser() ? TextWriter.Null : System.Console.Out;
    public static string? ReadLine() => In.ReadLine();
    public static void Write(string? value) => Out.Write(value);
    public static void WriteLine(string? value) => Out.WriteLine(value);
}
