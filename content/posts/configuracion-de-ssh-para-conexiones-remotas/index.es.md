---


# optional fields

weight: 2
title: 'Configuración de SSH para conexiones remotas'
date: 2017-04-26T00:00:00+00:00
lastmod: 2017-04-06T00:00:00+00:00
draft: false
author: 'Joel Jacquez'
authorLink: ''
#description: 'Find out how to create and organize your content quickly and intuitively in LoveIt theme.'
categories: [servidores, linux, ssh]
tags: [linux, ssh]

resources:
- name: 'featured-image'
  src: 'featured-image.jpg'

---



En este punto ya debemos de tener instalado **ssh** en nuestro servidor.

## Paso 1 Iniciar con usuario root

Lo primero que haremos será conectarnos a nuestro servidor remoto, y para eso utilizaremos el siguiente comando

<!--more-->

```bash
local$ ssh root@ip_del_servidor
```

una vez ingresado el comando nos pedira el password del usuario root

Es importante saber que el usuario **root** en linux es el usuario administrdor y por lo tanto tiene permisos para todo, lo cual no es recomendable tenerlo habilitado para conexiones **ssh**, esto nos lleva a nuestro segundo paso.

## Paso 2 Crear un nuevo usuario

Una vez que estamos dentro del servidor remoto como usuario **root**, ya estamos listos para crear una nueva cuenta de usuario que utilizaremos de ahora en adelante.

En este ejemplo llamaremos a nuestro usuario **_webapps_**, pero tu puedes usar el nombre que desees, para esto utilizaremos el siguiente comando:

```bash
root@server# adduser webapps
```

Esto nos hará una cuantas preguntas y nos pedira que ingresemos un password para este usuario, es importante que este password no lo vayamos a olvidar ya que será utilizado de ahora en adelante cuando ingresemos al servidor con este usuario.

## Paso 3 Privilegios de usuario _root_

Ahora que ya tenemos un cuenta de usuario con permisos regulares lo siguiente que haremos sera agregarle permisos de administrdor, y para eso lo agregaremos al grupo sudo por medio del siguiente comando

```bash
root@server# gpasswd -a webapps sudo
```

Ahora si ya podremos ejecutar comandos con privilegios/permisos de super usuario

## Paso 4 Configuración del servicio _SSH_

En este punto ya tenemos un nueva cuenta con la que podremos nos podremos conectar por ssh, lo siguiente es desabilitar la cuenta del usuario **_root_** para que no permita conexiones remotas con este usuario.

Lo que vamos a hacer ahora es editar el archivo de configuración **_ssh_** con el editor de texto **nano**

```bash
root@server# nano /etc/ssh/sshd_config
```

una vez abierto el archivo buscaremos la siguiente linea

```bash
PermitRootLogin yes
```

y ahora lo cambiaremos por la siguiente linea

```bash
PermitRootLogin no
```

> Siempre es recomendado desabilitar la cuenta **_root_** en cualquier servidor

Ahora para terminar toca salir del editor y guardar los cambios realizados para eso utilizaremos la siguiente combinación de teclas **ctrl** + **x** y luego **y**, y por ultimo la tecla **enter**

## Paso 5 Reiniciar el servidor SSH

Ya hemos terminado de configurar nuestro servidor ssh y para que los cambios surtan efecto tenemos que reniciar el servidor, y lo haremos de la suiente manera

```bash
root@server# service ssh restart
```

Para probar la nueva configuración cerraremos la conexión actual simplemente tecleando en la terminal

```bash
root@server# exit
```

> Si intentamos conectarnos con el usuario **_root_** ya no podremos de ahora en adelante nos conectaremos por ssh con el nuevo usuario en este caso **_webapps_**

De ahora en adelante nos conectaremos de la siguiente forma para este ejemplo seguiremos usando el usuario que creamos anteriormente

```bash
local$ ssh webapps@ip_del_servidor
```

y acontinuacion nos pedirá el password, una vez ejecutado el comando anterior ya estaremos de nuestro server pero ahora estamos con el usuario **_webapps_**.

## Paso 6 Agregar Clave pública al servidor (Opcional)

Este paso es opcional, pero recomenadado.

> Las siguientes instrucciones son para facilitarnos las cosas un poco mas y no tener que estar poniendo el password cada vez que intentemos conectarnos al servidor

Una vez aclarado el obejetivo de este paso, ahora si manos a la obra.

### Paso 6.a generar claves _ssh_

Lo primero que haremos sera crear un clave ssh (Si ya tienes una puedes omitir este paso)

```bash
local$ ssh-keygen -t rsa
```

y a continuación nos aparecerá algo parecido a esto

```bash
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/tu_user/.ssh/id_rsa):
```

Esto nos hara un par de preguntas y un vez terminado esto ya tendremos nuestro par de claves, una privada y una pública con los siguientes nombres respectivamente **_id_rsa_** y **_id_rsa.pub_** dentro de la carpeta **~/.ssh/**

### Paso 6.b Copiar clave pública

Lo que toca hacer ahora es copiar la clave publica que acabamos de generar en nuestro equipo local.

> Esta clave la copiaremos en el servidor al que nos queramos conectar, esto es para que ya no nos pida password cada vez que nos conectemos.

ahora mostraremos por terminal clave publica que acabamos de generar la cual tiene por nombre **id_rsa.pub** y para esto utilizaremos el siguiente comando

```bash
local$ cat ~/.ssh/id_rsa.pub
```

Este comando nos mostrara algo muy similar a esto

```bash
local$ cat ~/.ssh/id_rsa.pub
ssh-rsa AAaAB3NzaC1yc2EAAAADAQABAAABAQCx4mXCbQCtQOS3cSmJw0T2vu7OYHbz2uubGRIUNvYgILexZqJXQ1a4AOqM6nQpa8X4KH3BUxuNJeWrbJqOyKuCK6gNVGTthUKpq+3fWJmRgz8kI2MD/i58uQ+Mbz5IPHMlwdBCtja17hRpbZ8Mwf/yPuJ5YJtkV6pF5B3Yssi8d5xzJ0piL+dkd03f8swJ6OMdMEoEfG4MMnUyY/e3JJAxB2w0m38BMgoL4ZrxCojQeR6keux/Ad31iuvha6bcqB7325T98ICVxj7yOXP2LuDoVifveVm5M9fFN+G5NZae/+8vnoQBzuUX0oT0O21t7QxJ2bvRLLHIPiLXtry+vpjl tu_usuario@equipo_local
```

### Paso 6.c Copiar clave publica en el servidor remoto

Lo primero que haremos sera conectarnos al servidor con el usuario creado **_webapps_**

```bash
local$ ssh webapps@ip_del_servidor
```

una vez que estemos dentro del servido lo siguiente que haremos sera crear la carpeta **_.ssh_** dentro del home de la cuenta que estamos usando

> **Nota:** Tendremos que hacer esto por cada cuenta del servidor a la que nos queramos conectar.

```bash
webapps@server$ mkdir .ssh
webapps@server$ chmod 700 .ssh
```

Ahora con el edito **nano** crearemos y editaremos el archivo **_authorized_keys_** dentro del directorio **_.ssh_**

```bash
webapps@server$ nano .ssh/authorized_keys
```

y dentro de este archivo copiaremos el contenido de nuestra clave publica y posteriormente presionaremos **`ctrl`**+**`x`** y despues precionamos **`Y`** para confirmar los cambios.

Una vez finalizado la edición del archivo le asignaremos los permisos correspondientes

```bash
webapps@server$ chmod 600 .ssh/authorized_keys
```

Y ahora si hemos terminado de configurar el servidor, precederemos a salir y de ahora en adelante ya no será necesario ingresar el password cada vez que nos conectemos desde nuestro equipo.
