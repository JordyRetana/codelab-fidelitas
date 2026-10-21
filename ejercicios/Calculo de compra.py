
try:
    precio = float(input("Ingrese el precio unitario: "))
    cantidad = int(input("Ingrese la cantidad: "))

    if precio > 0 and cantidad > 0:
        subtotal = precio * cantidad

        if subtotal >= 50000:
            descuento = subtotal * 0.10
        else:
            descuento = 0

        base = subtotal - descuento
        impuesto = base * 0.13
        total = base + impuesto

        print(f"Subtotal: {subtotal:.2f}")
        print(f"Descuento: {descuento:.2f}")
        print(f"Base: {base:.2f}")
        print(f"Impuesto: {impuesto:.2f}")
        print(f"Total: {total:.2f}")
    else:
        print("El precio y la cantidad deben ser mayores que cero")

except ValueError:
    print("Error: ingrese un precio válido y una cantidad entera")
