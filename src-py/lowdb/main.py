from flata import Flata, where
from flata.storages import JSONStorage

# 使用参考：https://github.com/harryho/flata
db = Flata('./smfy_db.json', storage=JSONStorage)
t = db.table('grayVersions')
t.update({"userId": "沈晓洁2"}, where('id') == 6)
print(t.all())
