# Code Smells & Anti-patterns — `feature/order-details`

Este documento lista los code smells, anti-patrones y violaciones de principios SOLID
introducidos **intencionadamente** en esta rama, para usarlos como ejercicio de code
review (el objetivo es que un/a senior los detecte durante la entrevista).

> No arreglar nada de esto sin que se pida explícitamente: es el propósito de la rama.

## Backend — `OrderController.java`

| # | Smell / anti-patrón | Detalle |
|---|---|---|
| 1 | **Violación de SRP** | El controller hace IO (lectura de fichero), parseo JSON, lógica de negocio (cálculo de impuestos/descuentos) y serialización de la respuesta, todo en la misma clase/método. Debería delegarse en un `OrderRepository`/`OrderService` + DTOs. |
| 2 | **Ruta de fichero hardcodeada** | `new File("src/main/resources/data/orders.json")` es una ruta relativa que depende del directorio de ejecución; se rompe fuera del IDE o al empaquetar el JAR. Debería leerse como classpath resource (`ClassPathResource`, `@Value`, etc.). |
| 3 | **Instanciación manual en cada request** | `new ObjectMapper()` se crea dentro de cada método en lugar de inyectar un bean compartido (`ObjectMapper` ya gestionado por Spring). Caro y evita reutilizar configuración. |
| 4 | **Ausencia de DTOs / tipos débiles** | Se usan `Map<String, Object>` y `List` crudos en vez de clases de dominio (`Order`, `OrderItem`, `OrderSummary`). Provoca casts inseguros (`(Number) ...`) y cero seguridad de tipos. |
| 5 | **Números mágicos** | `0.21`, `0.10`, `0.05`, `100`, `200` repartidos por el código sin constantes ni nombre que explique su significado (tipo de IVA, umbral de descuento, etc.). |
| 6 | **Duplicación de lógica (DRY)** | El cálculo de `subtotal`/`tax`/`discount`/`total` está copiado y pegado entre `getOrders()` y `getOrder(id)`. Cualquier cambio de reglas de negocio hay que aplicarlo dos veces. |
| 7 | **Estado estático mutable y público** | `public static int requestCount` es un contador global mutable, no thread-safe, visible desde fuera de la clase. Anti-patrón clásico de estado compartido. |
| 8 | **Excepciones silenciadas** | `catch (Exception e) {}` se traga cualquier error (fichero no encontrado, JSON corrupto, etc.) sin loguearlo ni informar al cliente con un código de error adecuado. |
| 9 | **Logging con `System.out.println`** | En vez de un logger (`Slf4j`/`Logger`), se usa `System.out.println`, sin niveles, sin posibilidad de configurar salida ni formato. |
| 10 | **CORS abierto a cualquier origen** | `@CrossOrigin(origins = "*")` permite peticiones desde cualquier dominio; en producción esto es un riesgo de seguridad. |
| 11 | **Búsqueda lineal ineficiente** | `getOrder(id)` recorre toda la lista con un `for` en vez de usar una estructura indexada (`Map<Integer, Order>`) o una consulta a base de datos. |
| 12 | **Falta de manejo de "order not found"** | Si no se encuentra la orden, se devuelve un `Map` con `{"error": "Order not found"}` y HTTP 200, en vez de un `404 Not Found` real. |

## Frontend

### `order.service.ts`
| # | Smell / anti-patrón | Detalle |
|---|---|---|
| 13 | **URL hardcodeada** | `'http://localhost:8080/api/orders/' + id` está escrita a mano en el servicio en vez de usar `environment.ts` / `HttpClient` con baseUrl configurable. Rompe en cualquier entorno que no sea local. |
| 14 | **Tipos `any`** | `getOrder(id: number): any` y `getOrders(): any` renuncian completamente al tipado de TypeScript. |

### `order.component.ts` / `orders-list.component.ts`
| # | Smell / anti-patrón | Detalle |
|---|---|---|
| 15 | **NgRx configurado pero no usado** | El proyecto tiene `@ngrx/store` + `@ngrx/effects` instalados y provistos globalmente, pero toda la feature de "orders" gestiona su estado con variables de componente y llamadas HTTP directas. Inconsistencia arquitectónica: debería vivir en el store (actions/reducers/selectors/effects). |
| 16 | **Lógica de negocio duplicada en el cliente** | El cálculo de `tax`/`subtotal` se reimplementa en `OrderComponent` con los mismos números mágicos que en el backend (`0.21`, `0.1`, `100`). Doble fuente de verdad: si el backend cambia la regla, el front se desincroniza. |
| 17 | **Tipos `any` en toda la componente** | `order: any`, `(data: any) => ...`, sin modelos (`Order`, `OrderItem`) ni interfaces. |
| 18 | **`subscribe()` sin gestionar el ciclo de vida** | No se usa `async` pipe ni se desuscribe (`takeUntilDestroyed`, `Subscription` + `ngOnDestroy`). Riesgo de memory leak si el componente se destruye antes de que llegue la respuesta. |
| 19 | **`console.log` de depuración olvidado** | `console.log('order data', data)` / `console.log('orders list', data)` quedaron en el código de producción. |
| 20 | **Manual change detection (`ChangeDetectorRef.detectChanges()`)** | En vez de usar signals o el patrón `async` pipe (recomendado en una app zoneless), se fuerza la detección de cambios manualmente tras cada respuesta HTTP. Funciona, pero es un parche, no una solución idiomática. |
| 21 | **Sin manejo de errores HTTP** | Ninguna llamada a `getOrder`/`getOrders` maneja el callback de error de `subscribe`; si el backend falla, la UI se queda en blanco sin feedback al usuario. |
| 22 | **Sin estados de carga** | No hay spinner / skeleton mientras se espera la respuesta del backend, ni mensaje si la lista de órdenes está vacía. |
| 23 | **Acoplamiento por `@Input` sin "single source of truth"** | `App` guarda `selectedOrderId` y lo pasa a `OrderComponent` vía `@Input`, mientras que `OrdersListComponent` mantiene su propia lista independiente — el estado de "orden seleccionada" no vive en ningún sitio centralizado (otra vez, candidato natural para NgRx). |

## Correcciones ya aplicadas (no son parte del ejercicio de smells)

Estas sí fueron bugs reales corregidos durante el desarrollo, no smells a detectar:

- `OrderComponent` no reaccionaba a cambios del `@Input() orderId` porque solo cargaba datos en `ngOnInit`. Se añadió `ngOnChanges` para volver a pedir los datos cuando cambia el id seleccionado en la tabla.
- Import incorrecto de Jackson: Spring Boot 4.x usa Jackson 3 bajo el paquete `tools.jackson.*`, no `com.fasterxml.jackson.*`.
