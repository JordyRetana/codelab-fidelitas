// Lista donde se guardan todas las reservas
// Cada reserva tiene un codigo, laboratorio, hora de inicio y hora final
List<(string codigo, string lab, int inicio, int fin)> reservas = new();

// Variable para controlar las opciones del menu
int opcion = 0;

while (opcion != 4)
{
    Console.WriteLine("\n=== RESERVAS ===");
    Console.WriteLine("1. Registrar");
    Console.WriteLine("2. Listar");
    Console.WriteLine("3. Cancelar");
    Console.WriteLine("4. Salir");
    Console.Write("Opcion: ");

    // Comprobar que el usuario ingrese un numero valido.
    if (!int.TryParse(Console.ReadLine(), out opcion))
    {
        Console.WriteLine("Opcion invalida");
        continue;
    }

    //REGISTRAR UNA RESERVA
    if (opcion == 1)
    {
        // Solicitar el codigo de la reserva
        Console.Write("Codigo: ");
        string codigo = (Console.ReadLine() ?? "").Trim().ToUpper();

        // Solicitar el laboratorio
        Console.Write("Laboratorio: ");
        string lab = (Console.ReadLine() ?? "").Trim().ToUpper();

        // Verificar que el codigo y laboratorio no esten vacios
        if (codigo == "" || lab == "")
        {
            Console.WriteLine("Datos vacios");
            continue;
        }

        // Revisar si el codigo ya existe en la lista.
        // devuelve verdadero si encuentra una coincidencia.
        if (reservas.Any(r => r.codigo == codigo))
        {
            Console.WriteLine("Codigo duplicado");
            continue;
        }

        // Solicitar las horas de inicio y finalizacion
        Console.Write("Inicio (HH:MM): ");
        string h1 = (Console.ReadLine() ?? "").Trim();

        Console.Write("Fin (HH:MM): ");
        string h2 = (Console.ReadLine() ?? "").Trim();

        // Verificar que las horas tengan el formato HH:MM.
        if (!TimeSpan.TryParseExact(h1, @"hh\:mm", null, out TimeSpan t1) ||
            !TimeSpan.TryParseExact(h2, @"hh\:mm", null, out TimeSpan t2))
        {
            Console.WriteLine("Formato de hora invalido");
            continue;
        }

        // Convertir las horas a minutos
        int inicio = (int)t1.TotalMinutes;
        int fin = (int)t2.TotalMinutes;

        // Validar que la hora inicial debe ser menor que la final
        if (inicio < 480 || fin > 1080 || inicio >= fin)
        {
            Console.WriteLine("Horario invalido");
            continue;
        }

        // Comprobar si ya existe una reserva que choque con la nueva reserva
        bool conflicto = reservas.Any(r =>
            r.lab == lab &&
            inicio < r.fin &&
            fin > r.inicio);

        // Si existe un conflicto, se rechaza la reserva.
        if (conflicto)
        {
            Console.WriteLine("Reserva rechazada por conflicto");
        }
        else
        {
            // Si no existe conflicto, se guarda la nueva reserva.
            reservas.Add((codigo, lab, inicio, fin));
            Console.WriteLine("Reserva aceptada");
        }
    }

    //LISTAR LAS RESERVAS
    else if (opcion == 2)
    {
        // Solicitar el laboratorio que se desea consultar.
        Console.Write("Laboratorio: ");
        string lab = (Console.ReadLine() ?? "").Trim().ToUpper();

        // Se busca las reservas del laboratorio indicado y se ordena segun la hora
        var lista = reservas.Where(r => r.lab == lab)
                            .OrderBy(r => r.inicio).ToList();

        // Verificar si existen reservas para ese laboratorio
        if (lista.Count == 0)
            Console.WriteLine("No hay reservas");

        // Recorrer las reservas encontradas y mostrarlas
        foreach (var r in lista)
        {
            // Dividir los minutos entre 60 para obtener las horas
            Console.WriteLine(
                $"{r.codigo} - {r.lab}: " +
                $"{r.inicio / 60:D2}:{r.inicio % 60:D2} a " +
                $"{r.fin / 60:D2}:{r.fin % 60:D2}");
        }
    }

    //CANCELAR UNA RESERVA
    else if (opcion == 3)
    {
        // Solicitar el codigo de la reserva que se desea cancelar
        Console.Write("Codigo a cancelar: ");
        string codigo = (Console.ReadLine() ?? "").Trim().ToUpper();

        // Buscar y eliminar la reserva que tenga ese codigo y devuelve la cantidad de reservas eliminadas
        int eliminadas = reservas.RemoveAll(r => r.codigo == codigo);

        // Confirmar si la reserva fue eliminada.
        if (eliminadas > 0)
            Console.WriteLine("Reserva cancelada");
        else
            Console.WriteLine("Codigo no encontrado");
    }

    // Mostrar un error si se selecciona una opcion desconocida
    else if (opcion != 4)
    {
        Console.WriteLine("Opcion invalida");
    }
}