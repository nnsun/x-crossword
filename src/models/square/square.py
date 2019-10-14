class Square(object):
    def __init__(self, answer, num=''):
        if answer:
            self.is_black = False
        else:
            self.is_black = True
        self.num = num
        self.answer = answer
        self.check = 0
        self.guess = None

    def initial(self):
        d = {}
        d['is_black'] = self.is_black
        d['num'] = self.num
        return d