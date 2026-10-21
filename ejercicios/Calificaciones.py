import math
from statistics import median


def leer_cantidad():
    while True:
        try:
            cantidad = int(input("Cantidad de calificaciones: "))
            if cantidad > 0:
                return cantidad
        except ValueError:
            pass
        print("La cantidad debe ser un entero positivo")


def leer_notas(cantidad):
    notas = []
    while len(notas) < cantidad:
        try:
            nota = float(input(f"Nota {len(notas) + 1}: "))
            if math.isfinite(nota) and 0 <= nota <= 100:
                notas.append(nota)
            else:
                print("La nota debe estar entre 0 y 100")
        except ValueError:
            print("Ingrese una nota numérica")
    return notas


def resumir(notas):
    return {
        "promedio": sum(notas) / len(notas),
        "minima": min(notas),
        "maxima": max(notas),
        "aprobados": sum(nota >= 70 for nota in notas),
        "reprobados": sum(nota < 70 for nota in notas),
        "mediana": median(notas),
        "descendente": sorted(notas, reverse=True),
    }


def mostrar(notas, resumen):
    print(f"Promedio: {resumen['promedio']:.2f}")
    print(f"Mínima: {resumen['minima']:g}")
    print(f"Máxima: {resumen['maxima']:g}")
    print(f"Aprobados: {resumen['aprobados']}")
    print(f"Reprobados: {resumen['reprobados']}")
    print(f"Mediana: {resumen['mediana']:.2f}")
    print("Orden descendente: [" + ", ".join(f"{n:g}" for n in resumen['descendente']) + "]")
    print("Lista original: [" + ", ".join(f"{n:g}" for n in notas) + "]")


if __name__ == "__main__":
    notas = leer_notas(leer_cantidad())
    mostrar(notas, resumir(notas))
