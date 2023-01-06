import pygame


class Ship:
    """管理飞船的类"""

    def __init__(self, ai_game):
        """初始化飞船并设置其初始位置。"""
        self.screen = ai_game.screen
        self.settings = ai_game.settings

        self.screen_rect = ai_game.screen.get_rect()

        # 加载飞船图像并获取其外接矩形。
        self.image = pygame.image.load('images/ship.bmp')
        self.rect = self.image.get_rect()

        # 对于每艘新飞船，都将其放在屏幕底部的中央。
        print(self.screen_rect.midbottom)
        self.rect.midbottom = self.screen_rect.midbottom

        self.x = self.rect.x

        self.moving_right = False
        self.moving_left = False

    def update(self):
        if self.moving_right and self.rect.right < self.screen_rect.right:
            self.x += self.settings.ship_speed
        elif self.moving_left and self.rect.left > 0:
            self.x -= self.settings.ship_speed

        self.rect.x = self.x

    def blitme(self):
        """在指定位置绘制飞船。"""
        self.screen.blit(self.image, self.rect)

    def center_ship(self):
        """让飞船在屏幕底端居中。"""
        self.rect.midbottom = self.screen_rect.midbottom
        self.x = float(self.rect.x)
