
productos = {}

while True:
    print("\n--- CONTROL DE INVENTARIO ---")
    print("1. Registrar producto")
    print("2. Consultar producto")
    print("3. Ingresar unidades")
    print("4. Retirar unidades")
    print("5. Listar productos con stock bajo")
    print("6. Salir")

    opcion = input("Seleccione una opción: ")

    if opcion == "1":
        codigo = input("Código: ").strip().upper()

        if codigo == "":
            print("El código no puede estar vacío")
        elif codigo in productos:
            print("El código ya existe")
        else:
            nombre = input("Nombre: ")
            try:
                stock = int(input("Stock inicial: "))

                if stock >= 0:
                    productos[codigo] = {"nombre": nombre, "stock": stock}
                    print("Producto registrado")
                else:
                    print("El stock no puede ser negativo")
            except ValueError:
                print("El stock debe ser un número entero")

    elif opcion == "2":
        codigo = input("Código: ").strip().upper()

        if codigo in productos:
            print("Código:", codigo)
            print("Nombre:", productos[codigo]["nombre"])
            print("Stock:", productos[codigo]["stock"])
        else:
            print("Producto no encontrado")

    elif opcion == "3":
        codigo = input("Código: ").strip().upper()

        if codigo in productos:
            try:
                cantidad = int(input("Cantidad a ingresar: "))

                if cantidad > 0:
                    productos[codigo]["stock"] += cantidad
                    print("Nuevo stock:", productos[codigo]["stock"])
                else:
                    print("La cantidad debe ser mayor que cero")
            except ValueError:
                print("La cantidad debe ser un número entero")
        else:
            print("Producto no encontrado")

    elif opcion == "4":
        codigo = input("Código: ").strip().upper()

        if codigo in productos:
            try:
                cantidad = int(input("Cantidad a retirar: "))

                if cantidad <= 0:
                    print("La cantidad debe ser mayor que cero")
                elif cantidad > productos[codigo]["stock"]:
                    print("Stock insuficiente")
                else:
                    productos[codigo]["stock"] -= cantidad
                    print("Nuevo stock:", productos[codigo]["stock"])
            except ValueError:
                print("La cantidad debe ser un número entero")
        else:
            print("Producto no encontrado")

    elif opcion == "5":
        encontrados = False

        for codigo, datos in productos.items():
            if datos["stock"] <= 5:
                print(codigo, datos["nombre"], datos["stock"])
                encontrados = True

        if not encontrados:
            print("No hay productos con stock bajo")

    elif opcion == "6":
        print("Programa finalizado")
        break

    else:
        print("Opción inválida")
