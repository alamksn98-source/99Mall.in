import {NextResponse} from 'next/server';
import Razorpay from 'razorpay';
import {supabaseAdmin} from '@/lib/supabase-admin';
import {createClient} from '@supabase/supabase-js';
export async function POST(req:Request){
 try{
  const body=await req.json();const items=body.items as {product_id:string;quantity:number}[];
  if(!Array.isArray(items)||items.length===0||items.length>30) return NextResponse.json({error:'Invalid cart.'},{status:400});
  if(!body.address||String(body.phone||'').replace(/\D/g,'').length<10)return NextResponse.json({error:'Enter a valid delivery address and phone.'},{status:400});
  const auth=req.headers.get('authorization')||'';const token=auth.replace(/^Bearer\s+/i,'');
  if(!token)return NextResponse.json({error:'Please sign in before placing an order.'},{status:401});
  const userClient=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const {data:userData,error:userError}=await userClient.auth.getUser(token);if(userError||!userData.user)return NextResponse.json({error:'Please sign in again.'},{status:401});
  const db=supabaseAdmin();const ids=items.map(x=>x.product_id);
  if(ids.some(x=>!x||x.startsWith('demo-')))return NextResponse.json({error:'Demo items cannot be ordered. Add real products in Admin.'},{status:400});
  const {data:products,error}=await db.from('products').select('id,name,price,stock,active').in('id',ids);
  if(error||!products||products.length!==new Set(ids).size)return NextResponse.json({error:'Some products are unavailable.'},{status:400});
  let total=0;const lines=[];
  for(const item of items){const p=products.find(x=>x.id===item.product_id);const qty=Math.floor(Number(item.quantity));if(!p||!p.active||qty<1||qty>p.stock)return NextResponse.json({error:'Invalid quantity or insufficient stock for '+(p?.name||'product')},{status:400});total+=Number(p.price)*qty;lines.push({product_id:p.id,product_name:p.name,quantity:qty,unit_price:p.price});}
  const {data:order,error:orderError}=await db.from('orders').insert({customer_id:userData.user.id,status:'pending',total,delivery_address:String(body.address),phone:String(body.phone)}).select().single();
  if(orderError||!order)return NextResponse.json({error:'Could not create order.'},{status:500});
  const {error:itemError}=await db.from('order_items').insert(lines.map(x=>({...x,order_id:order.id})));
  if(itemError){await db.from('orders').delete().eq('id',order.id);return NextResponse.json({error:'Could not save order items.'},{status:500});}
  const key=process.env.RAZORPAY_KEY_ID,secret=process.env.RAZORPAY_KEY_SECRET;
  if(!key||!secret)return NextResponse.json({orderId:order.id,message:'Order saved as pending. Payment gateway is not configured yet.'});
  const gateway=new Razorpay({key_id:key,key_secret:secret});
  const paymentOrder=await gateway.orders.create({amount:Math.round(total*100),currency:'INR',receipt:order.id.slice(0,40)});
  await db.from('orders').update({razorpay_order_id:paymentOrder.id}).eq('id',order.id);
  return NextResponse.json({orderId:order.id,razorpayOrderId:paymentOrder.id,amount:paymentOrder.amount,currency:'INR',keyId:key});
 }catch(e){return NextResponse.json({error:'Checkout could not be completed. Check server configuration.'},{status:500});}
}
