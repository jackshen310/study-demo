from futu import *

quote_ctx = OpenQuoteContext(host='127.0.0.1', port=11111)  # 创建行情对象
# 订阅买卖摆盘类型，FutuOpenD 开始持续收到服务器的推送
quote_ctx.subscribe(['HK.00700'], [SubType.K_DAY])
# time.sleep(15)  # 设置脚本接收 FutuOpenD 的推送持续时间为15秒
ret, data = quote_ctx.get_market_snapshot('HK.00700')  # 获取港股 HK.00700 的快照数据
if ret == RET_OK:
    # 接口详情 https://openapi.futunn.com/futu-api-doc/quote/get-market-snapshot.html
    print(data['code'][0])
    print(data['last_price'][0])
    print(data['prev_close_price'][0])
    print(data['high_price'][0])
    print(data['low_price'][0])
else:
    print('error:', data)

ret, data = quote_ctx.get_cur_kline('HK.00700', 10)  # 获取港股 HK.00700 的快照数据
if ret == RET_OK:
    print(data)
else:
    print('error:', data)

quote_ctx.close()  # 关闭对象，防止连接条数用尽
