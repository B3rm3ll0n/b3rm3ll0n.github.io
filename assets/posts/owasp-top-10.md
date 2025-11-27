---
title: Vulnerabilidades OWASP Top 10
date: 2025-11-20
excerpt: Análisis profundo de las vulnerabilidades más críticas según OWASP Top 10 2023.
tags: owasp, web, seguridad, vulnerabilidades
---

# Vulnerabilidades OWASP Top 10

El OWASP Top 10 es una lista de las vulnerabilidades web más críticas y comunes. Entenderlas es esencial para cualquier profesional de seguridad.

## 1. Broken Access Control

La autenticación fallida es la vulnerabilidad #1. Los atacantes pueden:
- Eludir controles de acceso
- Escalar privilegios
- Acceder a recursos no autorizados

### Ejemplo vulnerable:
```python
if not user.is_authenticated:
    redirect_to_login()
# Pero falta verificación de autorización
return get_user_data(user_id)  # ¡Sin validar si pertenece al usuario!
```

### Solución:
```python
if not user.is_authenticated:
    redirect_to_login()
if not user.can_access(user_id):  # Verificar autorización
    raise PermissionDenied()
return get_user_data(user_id)
```

## 2. Cryptographic Failures

Fallos en criptografía pueden exponer datos sensibles.

**No hacer:**
- Almacenar contraseñas en texto plano
- Usar algoritmos débiles (MD5, SHA1)
- No usar HTTPS

**Hacer:**
- Usar bcrypt, scrypt o Argon2 para contraseñas
- HTTPS en todo el sitio
- Encriptar datos sensibles en reposo

## 3. Injection

SQL Injection, Command Injection, LDAP Injection...

### SQL Injection vulnerable:
```python
query = f"SELECT * FROM users WHERE email = '{email}'"
cursor.execute(query)
# Si email = "admin'--", obtiene todos los usuarios!
```

### SQL Injection seguro:
```python
query = "SELECT * FROM users WHERE email = %s"
cursor.execute(query, (email,))  # Parametrizado
```

## 4. Insecure Design

Falta de diseño de seguridad desde el inicio.

- No implementar rate limiting
- No validar entrada del usuario
- Asumir que los datos vienen de fuentes confiables

## 5. Security Misconfiguration

Configuraciones inseguras por defecto:
- Puertos abiertos innecesarios
- Servicios innecesarios activos
- Versiones antiguas sin parchear

## 6. Vulnerable and Outdated Components

Usar librerías con vulnerabilidades conocidas.

```bash
# Verificar dependencias
npm audit
pip check
```

## 7. Authentication Failures

- Contraseñas débiles sin validación
- Falta de 2FA
- Sessions sin timeout

## 8. Software and Data Integrity Failures

- Actualizaciones inseguras
- CI/CD inseguro
- Datos no validados

## 9. Logging and Monitoring Failures

No registrar eventos de seguridad suficientes.

## 10. Server-Side Request Forgery (SSRF)

El servidor realiza peticiones a recursos no permitidos.

```python
# Vulnerable
image_url = request.args.get('image_url')
response = requests.get(image_url)  # ¿Qué si es http://localhost/admin?

# Seguro
allowed_domains = ['images.example.com']
if not any(image_url.startswith(d) for d in allowed_domains):
    raise ValueError("Dominio no permitido")
response = requests.get(image_url)
```

## Mitigación General

1. **Input Validation**: Validar toda entrada
2. **Output Encoding**: Encodear salida
3. **Principle of Least Privilege**: Mínimos permisos
4. **Defense in Depth**: Múltiples capas
5. **Security Testing**: Pruebas regulares
6. **Keep Updated**: Parchear regularmente

## Referencias

- [OWASP Top 10 2023](https://owasp.org/Top10/)
- [OWASP API Top 10](https://owasp.org/www-project-api-security/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)

---

**Recuerda**: La seguridad es un proceso continuo, no un destino.
