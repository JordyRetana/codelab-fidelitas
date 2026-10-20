"""Ejercicio 6: implementación nueva con asistencia de OpenAI Codex.
No forma parte de los cuatro programas originales adjuntos.
"""
import csv
from decimal import Decimal, InvalidOperation

ENCABEZADO = "codigo,producto,cantidad,precio_unitario"


def validar_fila(fila, productos):
    if len(fila) != 4:
        raise ValueError("se requieren cuatro campos")
    codigo, nombre, cantidad, precio = [campo.strip() for campo in fila]
    codigo = codigo.upper()
    if not codigo or not nombre:
        raise ValueError("código y producto son obligatorios")
    try:
        unidades = int(cantidad)
    except ValueError:
        raise ValueError("cantidad debe ser un entero positivo") from None
    if unidades <= 0:
        raise ValueError("cantidad debe ser un entero positivo")
    try:
        importe = Decimal(precio)
    except InvalidOperation:
        raise ValueError("precio_unitario debe ser un número positivo") from None
    if not importe.is_finite() or importe <= 0:
        raise ValueError("precio_unitario debe ser un número positivo")
    if codigo in productos and productos[codigo]["producto"].lower() != nombre.lower():
        raise ValueError("nombre incompatible para el mismo código")
    return codigo, nombre, unidades, importe


def procesar(ruta):
    productos = {}
    validas = invalidas = 0
    try:
        with open(ruta, encoding="utf-8", newline="") as archivo:
            if archivo.readline().rstrip("\r\n") != ENCABEZADO:
                print("Encabezado incorrecto; no se crea ni sobrescribe el reporte")
                return
            for numero, linea in enumerate(archivo, start=2):
                try:
                    fila = next(csv.reader([linea], strict=True))
                    codigo, nombre, unidades, precio = validar_fila(fila, productos)
                    if codigo not in productos:
                        productos[codigo] = {"producto": nombre, "unidades": 0, "total": Decimal(0)}
                    productos[codigo]["unidades"] += unidades
                    productos[codigo]["total"] += unidades * precio
                    validas += 1
                except (ValueError, csv.Error, StopIteration) as error:
                    invalidas += 1
                    print(f"Error en línea {numero}: {error or 'fila vacía'}")
    except (OSError, UnicodeDecodeError) as error:
        print(f"No se pudo leer el archivo; no se modifica el reporte: {error}")
        return
    guardar_reporte(productos)
    print(f"Total general: {sum((p['total'] for p in productos.values()), Decimal(0)):.2f}")
    print(f"Filas válidas: {validas}; inválidas: {invalidas}")


def guardar_reporte(productos):
    ordenados = sorted(productos.items(), key=lambda item: (-item[1]["total"], item[0]))
    with open("reporte_ventas.csv", "w", encoding="utf-8", newline="") as archivo:
        escritor = csv.writer(archivo, lineterminator="\n")
        escritor.writerow(["codigo", "producto", "unidades", "total"])
        for codigo, datos in ordenados:
            escritor.writerow([codigo, datos["producto"], datos["unidades"], f"{datos['total']:.2f}"])
    print("Reporte generado: reporte_ventas.csv")
    with open("reporte_ventas.csv", encoding="utf-8") as archivo:
        print(archivo.read(), end="")


if __name__ == "__main__":
    procesar(input("Archivo CSV: ").strip())
