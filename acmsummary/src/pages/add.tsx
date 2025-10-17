import React from 'react'
import { Form, Input, Button, Card, Cascader, DatePicker, Divider, Typography, List } from 'antd'
import { questionDataFeedback, questionInfo } from '../utils/types'
import { Notyf } from 'notyf'
import FormItem from 'antd/es/form/FormItem'
import { useAuth } from '../components/AuthProvide'
import { getQuestionData, uploadQuestion, deleteQuestionAPI } from '../apis/questions'
import { useNavigate } from 'react-router-dom'
import { Axios, AxiosError } from 'axios'
import { errorResponse } from '../utils/types'
import { useEffect, useState } from 'react'
import { strCombine, strExtract } from '../utils/strHandle'

export default function AddPage(){

    const notify = new Notyf()

    const auth = useAuth()

    const [historyData, setHistoryData] = useState<questionDataFeedback[] | undefined>(undefined)

    //封装获取历史数据函数
    async function setHistoryDataFunction(){
        try{
            if(auth.user === null || auth.user.userId === null){
                notify.error('获取用户信息失败')
                return 
            }
            const result = await getQuestionData(auth.user.userId, auth.token)
            const resultData: questionDataFeedback[] = result.data.rows
            resultData.sort((a, b) => new Date(b.uploadtime).getTime() - new Date(a.uploadtime).getTime())
            setHistoryData(resultData)
        }
        catch(error){
            const tsError = error as AxiosError
                if(tsError.response){
                    const data = tsError.response.data as errorResponse
                    notify.error(data.message)
                }
                else{
                    notify.error('获取数据失败')
                }
        }
    }

    //表单提交
    async function onFinish(formdata:questionInfo){
        if(formdata.difficulty % 100 !== 0 || formdata.difficulty < 800 || formdata.difficulty > 3300){
            notify.error('请输入正确的难度(800-3300)')
            return 
        }
        if(auth.user === null || auth.user.userId === null){
            notify.error('获取用户信息失败')
            return
        }
        //不知道为什么取数据拿到的天数减了一
        const newDate = new Date(formdata?.solveTime)
        newDate.setDate(newDate.getDate() + 1)
        const formattedData = {
            ...formdata,
            solveTime: newDate,
            userId: auth.user.userId
        }
        try{
            const result = await uploadQuestion(formattedData, auth.token)
            notify.success(result.message)
        }
        catch(error){
            const tsError = error as AxiosError

            //检查服务端是否有响应
            if(tsError.response){
                const data = tsError.response?.data as errorResponse
                notify.error(data.message) //有响应则返回错误信息
            }
            else{
                notify.error('服务器未响应')
            }
        }
        setHistoryDataFunction()
    }
    function onFinishFailed(){
        notify.error('提交失败')
    }

    //获取历史数据
    useEffect(() => {
        setHistoryDataFunction()
    }, [])

    //点击删除问题
    async function deleteQuestion(id: number){
        try{
            if(auth.user === null || auth.user.userId === null){
                notify.error('获取用户信息失败')
                return
            }
            const result = await deleteQuestionAPI(id, auth.user.userId, auth.token)
            notify.success('删除成功')
        }
        catch(error){
            const tsError = error as AxiosError
            if(tsError.response){
                const data = tsError.response.data as errorResponse
                notify.error(data.message)
            }
            else{
                notify.error('删除失败')
            }
            console.log(error)
        }
        setHistoryDataFunction()
    }

    return (
        <div className='bg-gray-50'>
            <Card className='bg-gray-50'>
                <Form
                    name="basic"
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    style={{ maxWidth: 500 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >

                    <Form.Item
                    label="resource"
                    name = "resource"
                    >
                    <Input placeholder='请输入题目来源(CF1000A/P1000/arc100_a)'></Input>
                    </Form.Item>

                    <Form.Item
                    label="type"
                    rules = {[{ required: true }]}
                    name = 'type'
                    >
                    <Cascader
                    placeholder = '算法'
                    options={[
                        {
                            value: '算法基础',
                            label: '算法基础',
                            children: [
                                { value: '枚举', label: '枚举' },
                                { value: '模拟', label: '模拟' },
                                { value: '递归', label: '递归' },
                                { value: '分治', label: '分治' },
                                { value: '贪心', label: '贪心 ' },
                                { value: '排序', label: '排序' },
                                { value: '前缀和', label: '前缀和' },
                                { value: '差分', label: '差分' },
                                { value: '二分', label: '二分' },
                                { value: '倍增', label: '倍增' },
                                { value: '构造', label: '构造' }
                            ],
                        },
                        {
                            value:'动态规划DP',
                            label:'动态规划DP',
                            children:[
                                { value:'记忆化搜索', label:'记忆化搜索' },
                                { value:'背包DP', label:'背包DP' },
                                { value:'图上DP', label:'图上DP' },
                                { value:'数位DP', label:'数位DP' },
                                { value:'区间DP', label:'区间DP' },
                                { value:'树形DP', label:'树形DP' },
                                { value:'状压DP', label:'状压DP' },
                                { value:'插头DP', label:'插头DP' },
                                { value:'计数DP', label:'计数DP' },
                                { value:'动态DP', label:'动态DP' },
                                { value:'概率DP', label:'概率DP' },
                                { value:'DP套DP', label:'DP套DP' },
                                { value:'DP优化', label:'DP优化' },
                                { value:'其他DP', label:'其他DP' }
                            ]
                        },
                        {
                            value:'搜索',
                            label:'搜索',
                            children:[
                                { value:'BFS', label:'BFS' },
                                { value:'DFS', label:'DFS' },
                                { value:'剪枝', label:'剪枝' },
                                { value:'双向搜索', label:'双向搜索' },
                                { value:'启发式搜索', label:'启发式搜索' },
                                { value:'迭代加深搜索', label:'迭代加深搜索' },
                                { value:'DancingLinks', label:'DancingLinks' },
                                { value:'A*', label:'A*' },
                                { value:'IDA*', label:'IDA*' },
                                { value:'回溯法', label:'回溯法' },
                                { value:'Alpha-Beta剪枝', label:'Alpha-Beta剪枝' },
                            ]
                        },
                        {
                            value:'字符串',
                            label:'字符串',
                            children:[
                                { value:'字符串基础', label:'字符串基础' },
                                { value:'字符串匹配', label:'字符串匹配' },
                                { value:'字符串哈希', label:'字符串哈希' },
                                { value:'字典树', label:'字典树' },
                                { value:'KMP', label:'KMP' },
                                { value:'Boyer-Moore算法', label:'Boyer-Moore算法' },
                                { value:'Z函数', label:'Z函数' },
                                { value:'AC自动机', label:'AC自动机' },
                                { value:'后缀数组', label:'后缀数组' },
                                { value:'后缀自动机', label:'后缀自动机' },
                                { value:'后缀平衡树', label:'后缀平衡树' },
                                { value:'广义后缀自动机', label:'广义后缀自动机' },
                                { value:'后缀树', label:'后缀树' },
                                { value:'Manacher', label:'Manacher' },
                                { value:'回文树', label:'回文树' },
                                { value:'序列自动机', label:'序列自动机' },
                                { value:'最小表示法', label:'最小表示法' },
                                { value:'Lyndon分解', label:'Lyndon分解' },
                                { value:'Main-Lorentz算法', label:'Main-Lorentz算法' }
                            ]
                        },
                        {
                            value:'数学',
                            label:'数学',
                            children:[
                                { value:'进位制', label:'进位制' },
                                { value:'位运算', label:'位运算' },
                                { value:'二进制集合操作', label:'二进制集合操作' },
                                { value:'平衡三进制', label:'平衡三进制' },
                                { value:'高精度计算', label:'高精度计算' },
                                { value:'快速幂', label:'快速幂' },
                                { value:'置换和排列', label:'置换和排列' },
                                { value:'弧度制与坐标系', label:'弧度制与坐标系' },
                                { value:'复数', label:'复数' },
                                {
                                    value:'数论',
                                    label:'数论',
                                    children:[
                                        { value:'素数', label:'素数' },
                                        { value:'最大公约数', label:'最大公约数' },
                                        { value:'欧拉函数', label:'欧拉函数' },
                                        { value:'筛法', label:'筛法' },
                                        { value:'分解质因数', label:'分解质因数' },
                                        { value:'裴蜀定理', label:'裴蜀定理' },
                                        { value:'一次不定方程', label:'一次不定方程' },
                                        { value:'费马小定理', label:'费马小定理' },
                                        { value:'欧拉定理', label:'欧拉定理' },
                                        { value:'模逆元', label:'模逆元' },
                                        { value:'线性同余方程', label:'线性同余方程' },
                                        { value:'中国剩余定理', label:'中国剩余定理' },
                                        { value:'升幂定理', label:'升幂定理' },
                                        { value:'阶乘取模', label:'阶乘取模' },
                                        { value:'卢卡斯定理', label:'卢卡斯定理' },
                                        { value:'同余方程', label:'同余方程' },
                                        { value:'二次剩余', label:'二次剩余' },
                                        { value:'阶和原根', label:'阶和原根' },
                                        { value:'离散对数', label:'离散对数' },
                                        { value:'剩余', label:'剩余' },
                                        { value:'数论分块', label:'数论分块' },
                                        { value:'莫比乌斯反演', label:'莫比乌斯反演' },
                                        { value:'杜教筛', label:'杜教筛' },
                                        { value:'Powerful Number筛', label:'Powerful Number筛' },
                                        { value:'Min-25筛', label:'Min-25筛' },
                                        { value:'洲阁筛', label:'洲阁筛' },
                                        { value:'类欧几里得算法', label:'类欧几里得算法' },
                                        { value:'Meissel-Lehmer算法', label:'Meissel-Lehmer算法' },
                                        { value:'连分数', label:'连分数' },
                                        { value:'Stern-Brocot树与Farey序列', label:'Stern-Brocot树与Farey序列' },
                                        { value:'二次域', label:'二次域' },
                                        { value:'Pell方程', label:'Pell方程' },
                                    ]
                                },
                                { 
                                    value:'多项式与生成函数',
                                    label:'多项式与生成函数',
                                    children:[
                                        { value:'快速傅里叶变换', label:'快速傅里叶变换' },
                                        { value:'快速数论变换', label:'快速数论变换' },
                                        { value:'快速沃尔什变换', label:'快速沃尔什变换' },
                                        { value:'Chirp Z变换', label:'Chirp Z变换' },
                                        { value:'多项式牛顿迭代', label:'多项式牛顿迭代' },
                                        { value:'多项式多点求值', label:'多项式多点求值' },
                                        { value:'多项式初等函数', label:'多项式初等函数' },
                                        { value:'常系数齐次线性递推', label:'常系数齐次线性递推' },
                                        { value:'多项式平移', label:'多项式平移' },
                                        { value:'符号化方法', label:'符号化方法' },
                                        { value:'Lagrange反演', label:'Lagrange反演' },
                                        { value:'复合逆', label:'复合逆' },
                                        { value:'生成函数', label:'生成函数' }
                                    ]
                                },
                                {
                                    value:'组合数学',
                                    label:'组合数学',
                                    children:[
                                        { value:'排列组合', label:'排列组合' },
                                        { value:'抽屉原理', label:'抽屉原理' },
                                        { value:'容斥原理', label:'容斥原理' },
                                        { value:'斐波那契数列', label:'斐波那契数列' },
                                        { value:'错位排列', label:'错位排列' },
                                        { value:'卡特兰数', label:'卡特兰数' },
                                        { value:'斯特林数', label:'斯特林数' },
                                        { value:'贝尔数', label:'贝尔数' },
                                        { value:'伯努利数', label:'伯努利数' },
                                        { value:'Entringer Number', label:'Entringer Number' },
                                        { value:'Eulerian Number', label:'Eulerian Number' },
                                        { value:'分拆数', label:'分拆数' },
                                        { value:'范德蒙德卷积', label:'范德蒙德卷积' },
                                        { value:'Polya计数', label:'Polya计数' },
                                        { value:'图论计数', label:'图论计数' }
                                    ]
                                },
                                {
                                    value:'线性代数',
                                    label:'线性代数',
                                    children:[
                                        { value:'矩阵', label:'矩阵' },
                                        { value:'初等变换', label:'初等变换' },
                                        { value:'行列式', label:'行列式' },
                                        { value:'线性空间', label:'线性空间' },
                                        { value:'线性基', label:'线性基' },
                                        { value:'线性映射', label:'线性映射' },
                                        { value:'特征多项式', label:'特征多项式' },
                                        { value:'对角化', label:'对角化' },
                                        { value:'Jordan标准型', label:'Jordan标准型' }
                                    ]
                                },
                                { value:'线性规划', label:'线性规划' },
                                { 
                                    value:'抽象代数',
                                    label:'抽象代数',
                                    children:[
                                        { value:'群论', label:'群论' },
                                        { value:'环论', label:'环论' },
                                        { value:'域论', label:'域论' },
                                        { value:'Schreier-Sims算法', label:'Schreier-Sims算法' }
                                    ]
                                },
                                { 
                                    value:'概率论',
                                    label:'概率论',
                                    children:[
                                        { value:'条件概率', label:'条件概率' },
                                        { value:'随机变量', label:'随机变量' },
                                        { value:'概率不等式', label:'概率不等式' }
                                    ]
                                },
                                { 
                                    value:'博弈论',
                                    label:'博弈论',
                                    children:[
                                        { value:'公平组合游戏', label:'公平组合游戏' },
                                        { value:'零和游戏', label:'零和游戏' },
                                        { value:'非公平组合游戏', label:'非公平组合游戏' }
                                    ]
                                },
                                { 
                                    value:'数值算法',
                                    label:'数值算法',
                                    children:[
                                        { value:'插值', label:'插值' },
                                        { value:'数值积分', label:'数值积分' },
                                        { value:'高斯消元', label:'高斯消元' },
                                        { value:'牛顿迭代法', label:'牛顿迭代法' }
                                    ]
                                },
                                { value:'序理论', label:'序理论' },
                                { value:'杨氏矩阵', label:'杨氏矩阵' },
                                { value:'拟阵', label:'拟阵' },
                                { value:'Berlekamp-Massey算法', label:'Berlekamp-Massey算法' }
                            ]
                        },
                        {
                            value:'数据结构',
                            label:'数据结构',
                            children:[
                                { value:'栈', label:'栈' },
                                { value:'队列', label:'队列' },
                                { value:'链表', label:'链表' },
                                { value:'哈希表', label:'哈希表' },
                                { value:'并查集', label:'并查集' },
                                {
                                    value:'堆',
                                    label:'堆',
                                    children:[
                                        { value:'堆', label:'堆' },
                                        { value:'二叉堆', label:'二叉堆' },
                                        { value:'配对堆', label:'配对堆' },
                                        { value:'左偏树', label:'左偏树' }
                                    ]
                                },
                                {
                                    value:'块状数据结构',
                                    label:'块状数据结构',
                                    children:[
                                        { value:'分块', label:'分块' },
                                        { value:'块状数组', label:'块状数组' },
                                        { value:'块状链表', label:'块状链表' },
                                        { value:'树分块', label:'树分块' },
                                        { value:'Sqrt Tree', label:'Sqrt Tree' }
                                    ]
                                },
                                { value:'单调栈', label:'单调栈' },
                                { value:'单调队列', label:'单调队列' },
                                { value:'ST表', label:'ST表' },
                                { value:'树状数组', label:'树状数组' },
                                {
                                    value:'线段树',
                                    label:'线段树',
                                    children:[
                                        { value:'线段树', label:'线段树' },
                                        { value:'线段树合并/分裂', label:'线段树合并/分裂' },
                                        { value:'李超线段树', label:'李超线段树' },
                                        { value:'猫树', label:'猫树' },
                                        { value:'区间最值操作', label:'区间最值操作' }
                                    ]
                                },
                                { value:'划分树', label:'划分树' },
                                {
                                    value:'二叉搜索树与平衡树',
                                    label:'二叉搜索树与平衡树',
                                    children:[
                                        { value:'二叉搜索树与平衡树', label:'二叉搜索树与平衡树' },
                                        { value:'Treap', label:'Treap' },
                                        { value:'Splay树', label:'Splay树' },
                                        { value:'WBLT', label:'WBLT' },
                                        { value:'替罪羊树', label:'替罪羊树' },
                                        { value:'笛卡尔树', label:'笛卡尔树' },
                                        { value:'Size Balanced Tree', label:'Size Balanced Tree' },
                                        { value:'AVL树', label:'AVL树' },
                                        { value:'红黑树', label:'红黑树' },
                                        { value:'左偏红黑树', label:'左偏红黑树' },
                                        { value:'AA树', label:'AA树' }
                                    ]
                                },
                                { value:'跳表', label:'跳表' },
                                {
                                    value:'可持久化数据结构',
                                    label:'可持久化数据结构',
                                    children:[
                                        { value:'可持久化线段树', label:'可持久化线段树' },
                                        { value:'可持久化块状数组', label:'可持久化块状数组' },
                                        { value:'可持久化平衡树', label:'可持久化平衡树' },
                                        { value:'可持久化字典树', label:'可持久化字典树' },
                                        { value:'可持久化可并堆', label:'可持久化可并堆' }
                                    ]
                                },
                                {
                                    value:'树套树',
                                    label:'树套树',
                                    children:[
                                        { value:'线段树套线段树', label:'线段树套线段树' },
                                        { value:'平衡树套线段树', label:'平衡树套线段树' },
                                        { value:'线段树套平衡树', label:'线段树套平衡树' },
                                        { value:'树状数组套权值线段树', label:'树状数组套权值线段树' },
                                        { value:'分块套树状数组', label:'分块套树状数组' }
                                    ]
                                },
                                { value:'K-D树', label:'K-D树' },
                                {
                                    value:'动态树',
                                    label:'动态树',
                                    children:[
                                        { value:'Link Cut Tree', label:'Link Cut Tree' },
                                        { value:'全局平衡二叉树', label:'全局平衡二叉树' },
                                        { value:'Euler Tour Tree', label:'Euler Tour Tree' },
                                        { value:'Top Tree', label:'Top Tree' }
                                    ]
                                },
                                { value:'析合树', label:'析合树' },
                                { value:'PQ树', label:'PQ树' },
                                { value:'手指树', label:'手指树' },
                                { value:'霍夫曼树', label:'霍夫曼树' }
                            ]
                        },
                        {
                            value:'图论',
                            label:'图论',
                            children:[
                                { value:'DFS', label:'DFS' },
                                { value:'BFS', label:'BFS' },
                                { 
                                    value:'树上问题',
                                    label:'树上问题',
                                    children:[
                                        { value:'树基础', label:'树基础' },
                                        { value:'树的直径', label:'树的直径' },
                                        { value:'树的中心', label:'树的中心' },
                                        { value:'树的重心', label:'树的重心' },
                                        { value:'最近公共祖先', label:'最近公共祖先' },
                                        { value:'树链剖分', label:'树链剖分' },
                                        { value:'树上启发式合并', label:'树上启发式合并' },
                                        { value:'虚树', label:'虚树' },
                                        { value:'树分治', label:'树分治' },
                                        { value:'动态树分治', label:'动态树分治' },
                                        { value:'AHU算法', label:'AHU算法' },
                                        { value:'树哈希', label:'树哈希' },
                                        { value:'树上随机游走', label:'树上随机游走' }
                                    ] 
                                },
                                { value:'有向无环图', label:'有向无环图' },
                                { value:'拓扑排序', label:'拓扑排序' },
                                {
                                    value:'最短路问题',
                                    label:'最短路问题',
                                    children:[
                                        { value:'最短路', label:'最短路' },
                                        { value:'差分约束', label:'差分约束' },
                                        { value:'k短路', label:'k短路' },
                                        { value:'同余最短路', label:'同余最短路' }
                                    ]
                                },
                                {
                                    value:'生成树问题',
                                    label:'生成树问题',
                                    children:[
                                        { value:'最小生成树', label:'最小生成树' },
                                        { value:'最小树形图', label:'最小树形图' },
                                        { value:'最小直径生成树', label:'最小直径生成树' }
                                    ]
                                },
                                { value:'斯坦纳树', label:'斯坦纳树' },
                                { value:'拆点', label:'拆点' },
                                {
                                    value:'连通性问题',
                                    label:'连通性问题',
                                    children:[
                                        { value:'强连通分量', label:'强连通分量' },
                                        { value:'双连通分量', label:'双连通分量' },
                                        { value:'割点和桥', label:'割点和桥' },
                                        { value:'圆方树', label:'圆方树' },
                                        { value:'连通度', label:'连通度' }
                                    ]
                                },
                                { value:'环计数问题', label:'环计数问题' },
                                { value:'最小环', label:'最小环' },
                                { value:'2-SAT', label:'2-SAT' },
                                { value:'欧拉图', label:'欧拉图' },
                                { value:'平面图', label:'平面图' },
                                { value:'弦图', label:'弦图' },
                                { value:'图的着色', label:'图的着色' },
                                {
                                    value:'网络流',
                                    label:'网络流',
                                    children:[
                                        { value:'最大流', label:'最大流' },
                                        { value:'最小割', label:'最小割' },
                                        { value:'费用流', label:'费用流' },
                                        { value:'上下界网络流', label:'上下界网络流' },
                                        { value:'Stoer-Wagner算法', label:'Stoer-Wagner算法' }
                                    ]
                                },
                                {
                                    value:'图的匹配',
                                    label:'图的匹配',
                                    children:[
                                        { value:'图匹配', label:'图匹配' },
                                        { value:'二分图最大匹配', label:'二分图最大匹配' },
                                        { value:'二分图最大权匹配', label:'二分图最大权匹配' },
                                        { value:'一般图最大匹配', label:'一般图最大匹配' },
                                        { value:'一般图最大权匹配', label:'一般图最大权匹配' },
                                        { value:'稳定匹配', label:'稳定匹配' }
                                    ]
                                },
                                { value:'Prufer序列', label:'Prufer序列' },
                                { value:'矩阵树定理', label:'矩阵树定理' },
                                { value:'LGV引理', label:'LGV引理' },
                                { value:'最大团搜索算法', label:'最大团搜索算法' },
                                { value:'支配树', label:'支配树' },
                                { value:'图上随机游走', label:'图上随机游走' }
                            ]
                        },
                        {
                            value:'计算几何',
                            label:'计算几何',
                            children:[
                                { value:'二维计算几何基础', label:'二维计算几何基础' },
                                { value:'三维计算几何基础', label:'三维计算几何基础' },
                                { value:'距离', label:'距离' },
                                { value:'Pick定理', label:'Pick定理' },
                                { value:'三角剖分', label:'三角剖分' },
                                { value:'凸包', label:'凸包' },
                                { value:'扫描线', label:'扫描线' },
                                { value:'旋转卡壳', label:'旋转卡壳' },
                                { value:'半平面交', label:'半平面交' },
                                { value:'平面最近点对', label:'平面最近点对' },
                                { value:'随机增量法', label:'随机增量法' },
                                { value:'反演变换', label:'反演变换' },
                                { value:'计算几何杂项', label:'计算几何杂项' }
                            ]
                        },
                        {
                            value:'杂项',
                            label:'杂项',
                            children:[
                                { value:'离散化', label:'离散化' },
                                { value:'双指针', label:'双指针' },
                                { 
                                    value:'离线算法',
                                    label:'离线算法',
                                    children:[
                                        { value:'CDQ分治', label:'CDQ分治' },
                                        { value:'整体二分', label:'整体二分' },
                                        {
                                            value:'莫队算法',
                                            label:'莫队算法',
                                            children:[
                                                { value:'普通莫队算法', label:'普通莫队算法' },
                                                { value:'带修改莫队', label:'带修改莫队' },
                                                { value:'树上莫队', label:'树上莫队' },
                                                { value:'回滚莫队', label:'回滚莫队' },
                                                { value:'二维莫队', label:'二维莫队' },
                                                { value:'莫队二次离线', label:'莫队二次离线' },
                                                { value:'莫队配合bitset', label:'莫队配合bitset' }
                                            ]
                                        },
                                        { value:'分数规划', label:'分数规划' },
                                        {
                                            value:'随机化',
                                            label:'随机化',
                                            children:[
                                                { value:'随机函数', label:'随机函数' },
                                                { value:'爬山算法', label:'爬山算法' },
                                                { value:'模拟退火', label:'模拟退火' }
                                            ]
                                        },
                                        { value:'悬线法', label:'悬线法' },
                                        { value:'有限状态自动机', label:'有限状态自动机' },
                                        { value:'约瑟夫问题', label:'约瑟夫问题' },
                                        { value:'格雷码', label:'格雷码' },
                                        { value:'表达式求值', label:'表达式求值' },
                                        { value:'主元素问题', label:'主元素问题' },
                                        { value:'Garsia-Wachs算法', label:'Garsia-Wachs算法' },
                                        { value:'15-puzzle', label:'15-puzzle' },
                                        { value:'Kahan求和', label:'Kahan求和' },
                                        { value:'珂朵莉树/ODT', label:'珂朵莉树/ODT' },
                                        { value:'空间优化', label:'空间优化' }
                                    ] 
                                },
                            ]
                        }
                    ]}
                    />
                    </Form.Item>

                    <Form.Item
                    label="difficulty"
                    rules = {[{ required: true, message: '请输入问题难度!' }]}
                    name = "difficulty"
                    >
                    <Input placeholder='codeforces难度' />
                    </Form.Item>

                    <FormItem
                    label = "solveTime"
                    rules = {[{ required: true, message: '请选择完成日期!' }]}
                    name = "solveTime"
                    >
                    <DatePicker />
                    </FormItem>
                    <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" className = "active:bg-blue-800 active:scale-90">
                        添加题目
                    </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card className='bg-gray-50'>
                <div className="text-lg">历史记录</div>
                <List
                    pagination={{ position:'bottom', align:'center', pageSize: 5 }}
                    dataSource={historyData}
                    renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                        title={item.resource}
                        description={<a href="https://oi-wiki.org/">{strExtract(item.type)}</a>}
                        />
                        <div className='p-2'>难度:{item.difficulty}</div>
                        <Button className='active:bg-blue-800' onClick={() => deleteQuestion(item.id)}>删除</Button>
                    </List.Item>
                    )}
                />
            </Card>
        </div>
    )
}