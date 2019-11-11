import time


class Square(object):
    def __init__(self, answer, num=''):
        self.is_black = not bool(answer)
        self.num = num
        self.answer = answer
        self.check = 0
        self.guess = None
        self.timestamp = 0

    def initial(self):
        d = {}
        d['is_black'] = self.is_black
        d['num'] = self.num
        return d
