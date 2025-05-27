import pygame
from math import cos, sin, pi
from numpy import matrix
from time import sleep
from random import randint


WHITE = (255, 255, 255)
WIDTH = 500
HEIGHT = 500

pygame.init()
display = pygame.display
surface = display.set_mode((WIDTH, HEIGHT))
display.set_caption("3D")


done = False
points = (
    ( 50,  50,  50),
    (-50,  50,  50),
    ( 50, -50,  50),
    ( 50,  50, -50),
    (-50,  50, -50),
    ( 50, -50, -50),
    (-50, -50, -50),
    (-50, -50,  50),
)

rotation = [0, 0, 0]


def generate_x(theta):
    return matrix([
        [1, 0, 0],
        [0, cos(theta), -sin(theta)],
        [0, sin(theta), cos(theta)]
    ])

def generate_y(theta):
    return matrix([
        [cos(theta), 0, -sin(theta)],
        [0, 1, 0],
        [sin(theta), 0, cos(theta)]
    ])

def generate_z(theta):
    return matrix([
        [cos(theta), -sin(theta), 0],
        [sin(theta), cos(theta), 0],
        [0, 0, 1]
    ])


while not done:
    for e in pygame.event.get():
        if e.type == pygame.QUIT:
            done = True
            break

    pygame.draw.rect(surface, (0, 0, 0), pygame.Rect(0, 0, WIDTH, HEIGHT))

    render_points = []

    for p in points:

        m = matrix([
        [p[0]],
        [p[1]],
        [p[2]]
        ])

        for method, angle in zip((generate_x, generate_y, generate_z), rotation):
            m = method(angle) * m

        x, y, z = map(lambda x: int(WIDTH/2 - x), (m[0,0], m[1,0], m[2,0]))

        render_points.append((x, y))

    for p1 in range(len(render_points) - 1):
        for p2 in render_points[p1 + 1:]:
            pygame.draw.line(surface, WHITE, render_points[p1], p2)

    rotation[0] += pi / randint(100, 200)
    rotation[1] += pi / randint(100, 200)

    display.flip()
    sleep(1/45)
