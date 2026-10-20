using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.JSInterop;
using System.Reflection;
using System.Globalization;
using Console = CodeLab.ConsoleAdapter;

var host = WebAssemblyHostBuilder.CreateDefault(args).Build();
await host.Services.GetRequiredService<IJSRuntime>().InvokeVoidAsync("codeLabDotnetReady");
await host.RunAsync();

public static class Bridge
{
    [JSInvokable]
    public static string Run(int exercise, string input)
    {
        if (exercise != 2 && exercise != 5) throw new ArgumentException("Ejercicio desconocido");
        var oldIn = Console.In; var oldOut = Console.Out;
        using var output = new StringWriter(CultureInfo.InvariantCulture);
        try
        {
            CultureInfo.CurrentCulture = CultureInfo.InvariantCulture;
            Console.In = new BoundedReader(input); Console.Out = output;
            var assembly = Assembly.Load(exercise == 2 ? "Frases" : "Reservas");
            var entry = assembly.EntryPoint!;
            entry.Invoke(null, entry.GetParameters().Length == 0 ? null : new object[] { Array.Empty<string>() });
        }
        catch (TargetInvocationException e) { output.WriteLine("\n[Adaptador: " + e.InnerException?.Message + "]"); }
        finally { Console.In = oldIn; Console.Out = oldOut; }
        return output.ToString();
    }
}
sealed class BoundedReader(string text) : StringReader(text)
{
    private int reads;
    public override string? ReadLine()
    {
        if (++reads > 1000) throw new InvalidOperationException("Límite de 1000 entradas alcanzado.");
        return base.ReadLine() ?? throw new InvalidOperationException("Se agotaron las entradas. Añade las respuestas que faltan y vuelve a ejecutar.");
    }
}
