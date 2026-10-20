class Program
{
    static void Main()
    {
        Console.Write("Ingrese una frase: ");
        string frase = Console.ReadLine() ?? "";

        if (string.IsNullOrWhiteSpace(frase))
        {
            Console.WriteLine("La frase no puede estar vacia.");
            return;
        }

        // Normalizar espacios
        frase = string.Join(" ", frase.Split(' ',
            StringSplitOptions.RemoveEmptyEntries));

        int palabras = 0;
        int vocales = 0;
        int digitos = 0;

        // Contar palabras
        foreach (string palabra in frase.Split(' '))
        {
            if (palabra.Any(char.IsLetterOrDigit))
                palabras++;
        }

        // Contar vocales y numeros
        foreach (char c in frase.ToLower())
        {
            if ("aeiouáéíóúü".Contains(c))
                vocales++;

            if (c >= '0' && c <= '9')
                digitos++;
        }

        // Comprobar palindromo
        string limpia = frase.ToLower()
            .Replace('á', 'a')
            .Replace('é', 'e')
            .Replace('í', 'i')
            .Replace('ó', 'o')
            .Replace('ú', 'u')
            .Replace('ü', 'u');

        limpia = new string(limpia.Where(char.IsLetterOrDigit).ToArray());

        string invertida = new string(limpia.Reverse().ToArray());

        string palindromo = limpia.Length == 0
            ? "No evaluable"
            : limpia == invertida ? "Si" : "No";

        // Resultados
        Console.WriteLine("\nRESULTADOS");
        Console.WriteLine("Palabras: " + palabras);
        Console.WriteLine("Vocales: " + vocales);
        Console.WriteLine("Digitos: " + digitos);
        Console.WriteLine("Palindromo: " + palindromo);
    }
}